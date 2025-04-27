import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { toast } from "react-hot-toast";
import { api } from "../../../store/apis";
import {
  chatBoxWrapper,
  chatBoxHeader,
  chatMessagesContainer,
  chatMessage,
  chatBubble,
  chatInputContainer,
} from "./Chatbox";

const ChatBox = ({ onClose, onSaveAssessment }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const startChat = async () => {
      try {
        const response = await axios.post(
          "https://pranaychamala-uspark.hf.space/chat/start",
          {},
          { headers: { "Content-Type": "application/json" } }
        );
        const { session_id, reply } = response.data;
        setSessionId(session_id);
        setMessages([
          { sender: "bot", text: reply || "Hello! How can I help you today?" },
        ]);
      } catch (error) {
        setMessages([
          { sender: "bot", text: "Hello! (Couldn't connect properly.)" },
        ]);
      }
    };

    startChat();
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const saveChatHistory = async (fullMessages) => {
    try {
      await api.post(
        "/api/chathistory/save",
        { sessionId, messages: fullMessages },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Chat saved!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save chat!");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !sessionId) return;

    const userMessage = { sender: "user", text: newMessage };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://pranaychamala-uspark.hf.space/chat/message",
        { session_id: sessionId, message: newMessage },
        { headers: { "Content-Type": "application/json" } }
      );

      const botReply = {
        sender: "bot",
        text: response.data.response || "Sorry, I couldn't understand.",
      };
      const finalMessages = [...updatedMessages, botReply];
      setMessages(finalMessages);

      
      if (
        botReply.text.toLowerCase().includes("thank you for the") ||
        botReply.text.toLowerCase().includes("session ended")
      ) {
        console.log("💾 Session end detected. Saving chat...");
        await saveChatHistory(finalMessages);

        if (onSaveAssessment) {
          const combinedSummary = finalMessages
            .map((m) => {
              return (m.sender === "bot" ? "Doctor: " : "You: ") + m.text;
            })
            .join("\n");

          onSaveAssessment(combinedSummary);

        }
      }

    } catch (error) {
      const errorReply = { sender: "bot", text: "Oops! Something went wrong." };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

const handleCloseChat = async () => {
  try {
    if (sessionId && messages.length > 0) {
      await saveChatHistory(messages);
    }
  } finally {
    onClose(); // Only close the chat, don't add assessment here
  }
};


  return (
    <Box sx={chatBoxWrapper}>
      <Box sx={chatBoxHeader}>
        <Typography variant="h6">Uheal Chatbot</Typography>
        <IconButton size="small" onClick={handleCloseChat}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={chatMessagesContainer}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={chatMessage(msg.sender)}>
            <Box sx={chatBubble(msg.sender)}>
              <Typography variant="body2">{msg.text}</Typography>
            </Box>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      <Box sx={chatInputContainer}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={loading || !sessionId || !newMessage.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
