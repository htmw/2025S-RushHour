import pandas as pd
import json
import numpy as np
import faiss
from sklearn.feature_extraction.text import TfidfVectorizer
from transformers import pipeline

# -------------------------------
# Load disease data and preprocess
# -------------------------------
def load_disease_data(csv_path):
    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip().str.lower()
    df = df.fillna("")
    disease_symptoms = {}
    disease_precautions = {}
    for _, row in df.iterrows():
        disease = row["disease"].strip()
        symptoms = [s.strip().lower() for s in row["symptoms"].split(",") if s.strip()]
        precautions = [p.strip() for p in row["precautions"].split(",") if p.strip()]
        disease_symptoms[disease] = symptoms
        disease_precautions[disease] = precautions
    return disease_symptoms, disease_precautions

# Load CSV data (ensure this CSV file is in the repository root)
disease_symptoms, disease_precautions = load_disease_data("disease_sympts_prec_full.csv")
known_symptoms = set()
for syms in disease_symptoms.values():
    known_symptoms.update(syms)

# -------------------------------
# Build symptom vectorizer and FAISS index
# -------------------------------
vectorizer = TfidfVectorizer()
symptom_texts = [" ".join(symptoms) for symptoms in disease_symptoms.values()]
tfidf_matrix = vectorizer.fit_transform(symptom_texts).toarray()
index = faiss.IndexFlatL2(tfidf_matrix.shape[1])
index.add(np.array(tfidf_matrix, dtype=np.float32))
disease_list = list(disease_symptoms.keys())

def find_closest_disease(user_symptoms):
    if not user_symptoms:
        return None
    user_vector = vectorizer.transform([" ".join(user_symptoms)]).toarray().astype("float32")
    distances, indices = index.search(user_vector, k=1)
    return disease_list[indices[0][0]]

# -------------------------------
# Load Medical NER model for symptom extraction
# -------------------------------
medical_ner = pipeline(
    "ner",
    model="blaze999/Medical-NER",
    tokenizer="blaze999/Medical-NER",
    aggregation_strategy="simple"
)

def extract_symptoms_ner(text):
    results = medical_ner(text)
    extracted = []
    for r in results:
        if "SIGN_SYMPTOM" in r["entity_group"]:
            extracted.append(r["word"].lower())
    return list(set(extracted))

def is_affirmative(answer):
    answer_lower = answer.lower()
    return any(word in answer_lower for word in ["yes", "yeah", "yep", "certainly", "sometimes", "a little"])

# -------------------------------
# Chatbot session class
# -------------------------------
class ChatbotSession:
    def __init__(self):
        self.conversation_history = []
        self.reported_symptoms = set()
        self.asked_missing = set()
        self.awaiting_followup = None
        self.state = "symptom_collection"  # states: symptom_collection, pain, medications
        # Initial greeting
        greeting = "Doctor: Hello, I am your virtual doctor. What brought you in today?"
        self.conversation_history.append(greeting)
        self.finished = False

    def process_message(self, message: str) -> str:
        # State: collecting symptoms
        if self.state == "symptom_collection":
            if message.lower() in ["exit", "quit", "no"]:
                self.state = "pain"
                prompt = "Doctor: Do you experience any pain or aches? Please rate the pain on a scale of 1 to 10 (or type 'no' if none):"
                self.conversation_history.append(prompt)
                return prompt
            # If we are waiting on a follow-up about a specific symptom
            if self.awaiting_followup:
                if is_affirmative(message):
                    self.reported_symptoms.add(self.awaiting_followup)
                self.asked_missing.add(self.awaiting_followup)
                self.awaiting_followup = None
            else:
                # Extract symptoms from message text
                ner_results = extract_symptoms_ner(message)
                for sym in ner_results:
                    if sym not in self.reported_symptoms:
                        self.reported_symptoms.add(sym)
            # Update predicted disease
            predicted_disease = find_closest_disease(list(self.reported_symptoms)) if self.reported_symptoms else None
            # Check for missing symptoms if a disease is predicted
            if predicted_disease:
                expected = set(disease_symptoms.get(predicted_disease, []))
                missing = expected - self.reported_symptoms
                not_asked = missing - self.asked_missing
                if not_asked:
                    symptom_to_ask = list(not_asked)[0]
                    followup = f"Are you also experiencing {symptom_to_ask}?"
                    self.conversation_history.append("Doctor: " + followup)
                    self.awaiting_followup = symptom_to_ask
                    return followup
            prompt = "Doctor: Do you have any other symptoms you'd like to mention?"
            self.conversation_history.append(prompt)
            return prompt

        # State: asking about pain
        elif self.state == "pain":
            try:
                self.pain_level = int(message)
            except ValueError:
                self.pain_level = message
            self.state = "medications"
            prompt = "Doctor: Have you taken any medications recently? If yes, please specify (or type 'no' if none):"
            self.conversation_history.append(prompt)
            return prompt

        # State: asking about medications
        elif self.state == "medications":
            self.medications = message if message.lower() not in ["no", "none"] else "None"
            closing = "Doctor: Thank you for providing all the information."
            self.conversation_history.append(closing)
            self.finished = True
            return closing

        return "Doctor: I'm sorry, I didn't understand that."

    def get_data(self):
        return {
            "conversation": self.conversation_history,
            "symptoms": list(self.reported_symptoms),
            "pain_level": getattr(self, "pain_level", None),
            "medications": getattr(self, "medications", None)
        }
