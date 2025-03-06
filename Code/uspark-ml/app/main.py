from fastapi import FastAPI, UploadFile, File, HTTPException
from uuid import uuid4
import io
from PIL import Image
from pydantic import BaseModel
import gradio as gr

# Import modules from the Uspark package
from app.chatbot import ChatbotSession
from app.mediseg import complete_pipeline_image
from app.database import save_chat_session, save_medseg_result

app = FastAPI(title="Uspark API")

# Ensure models are loaded from the 'models' directory within 'Uspark'
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "../models"))

class ChatMessage(BaseModel):
    session_id: str
    message: str

# In-memory session store (for demo purposes; consider persistent storage for production)
sessions = {}

@app.post("/chat/start")
def start_chat():
    session_id = str(uuid4())
    session = ChatbotSession()
    sessions[session_id] = session
    return {"session_id": session_id, "message": session.conversation_history[0]}

@app.post("/chat/message")
def chat_message(chat: ChatMessage):
    if chat.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Invalid session_id")
    
    session = sessions[chat.session_id]
    response = session.process_message(chat.message)
    
    # If the session has finished (after pain & medication), save to MongoDB and remove from memory.
    if session.finished:
        save_chat_session(chat.session_id, session.get_data())
        del sessions[chat.session_id]
    
    return {"response": response, "conversation": session.conversation_history}

@app.post("/medseg")
async def medseg_endpoint(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")
    
    # Process image through the complete pipeline (classification + segmentation)
    result = complete_pipeline_image(image)
    
    # Save result to MongoDB
    result_record = {
        "filename": file.filename,
        "result": result  # Contains predicted modality and base64 image(s)
    }
    save_medseg_result(result_record)
    
    return result

# Gradio Interface
def my_model(input_text):
    return f"Processed: {input_text}"

gradio_app = gr.Interface(fn=my_model, inputs="text", outputs="text")

# Mount Gradio app inside FastAPI
app = gr.mount_gradio_app(app, gradio_app, path="/gradio")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
