import React, { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setOpen(!open);
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages([...messages, userMessage]);
      setInput("");

      try {
        const response = await axios.post("http://localhost:5001/api/chat", {
          message: input,
        });

        const botMessage = { text: response.data.response, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Chatbot Error:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, I couldn't get a response.", sender: "bot" },
        ]);
      }
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Box
        sx={{ position: "fixed", bottom: 20, right: 20, textAlign: "center" }}
      >
        <IconButton
          sx={{
            backgroundColor: "#007bff",
            color: "white",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
          onClick={toggleChat}
        >
          <ChatIcon />
        </IconButton>
        <Typography variant="caption" sx={{ color: "#007bff", mt: 1 }}>
          MediBot
        </Typography>
      </Box>

      {/* Chatbox */}
      {open && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 300,
            height: 400,
            display: "flex",
            flexDirection: "column",
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#007bff",
              color: "white",
              padding: "8px 12px",
            }}
          >
            <Typography variant="h6">MediBot</Typography>
            <IconButton onClick={toggleChat} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              padding: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((msg, index) => (
              <Typography
                key={index}
                sx={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    msg.sender === "user" ? "#007bff" : "#e0e0e0",
                  color: msg.sender === "user" ? "white" : "black",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "70%",
                }}
              >
                {msg.text}
              </Typography>
            ))}
          </Box>

          {/* Input Field */}
          <Box
            sx={{
              display: "flex",
              padding: "8px",
              borderTop: "1px solid #ddd",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              sx={{ ml: 1 }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default Chatbot;
