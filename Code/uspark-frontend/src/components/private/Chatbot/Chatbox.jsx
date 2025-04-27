import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  startChatWithBot,
  sendMessageWithBot,
  saveChatHistory,
} from "../../../store/actions";

const ChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([]); // Local state for messages
  const [newMessage, setNewMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation popup
  const [suggestions, setSuggestions] = useState([]); // Auto-suggestions
  const bottomRef = useRef(null);
  const inputRef = useRef(null); // Ref for the TextField
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const {
    sessionId,
    loading,
    error,
    messages: reduxMessages,
  } = useSelector((state) => state.chatHistory);

  useEffect(() => {
    dispatch(startChatWithBot());
  }, [dispatch]);

  useEffect(() => {
    // Append new messages from Redux state to local state
    const newMessages = reduxMessages
      .map((msg) => {
        if (msg.sender === "bot" || msg.sender === "user") {
          return msg;
        } else if (msg.response) {
          return { sender: "bot", text: msg.response };
        }
        return null;
      })
      .filter(Boolean); // Remove null values

    setMessages((prevMessages) => {
      // Avoid duplicating messages
      const existingTexts = prevMessages.map((m) => m.text);
      const uniqueMessages = newMessages.filter(
        (msg) => !existingTexts.includes(msg.text)
      );
      return [...prevMessages, ...uniqueMessages];
    });

    // Generate suggestions based on the latest bot message
    if (reduxMessages.length > 0) {
      const lastBotMessage = reduxMessages[reduxMessages.length - 1];
      generateSuggestions(lastBotMessage?.response || "");
    }
  }, [reduxMessages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the TextField when a new message is received
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

  const generateSuggestions = (botMessage) => {
    // Dynamically generate suggestions based on the bot's message
    const lowerCaseMessage = botMessage.toLowerCase();

    if (lowerCaseMessage.includes("how severe")) {
      setSuggestions(["Mild", "Moderate", "Severe"]);
    } else if (lowerCaseMessage.includes("where exactly")) {
      setSuggestions(["Head", "Chest", "Stomach"]);
    } else if (lowerCaseMessage.includes("any more symptoms")) {
      setSuggestions(["No"]);
    } else if (lowerCaseMessage.includes("rate it 1-10")) {
      setSuggestions(["1", "5", "10"]);
    } else if (lowerCaseMessage.includes("medications recently")) {
      setSuggestions(["No"]);
    } else {
      setSuggestions([]); // Clear suggestions if no relevant options
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || !sessionId) return;

    // Add the user's message to the local state
    const userMessage = { sender: "user", text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage("");
    setSuggestions([]); // Clear suggestions after sending a message

    // Dispatch the Redux action to send the message
    dispatch(
      sendMessageWithBot({
        sessionId,
        message,
        onSuccess: (botReply) => {
          // Add the bot's reply to the local state
          const botMessage = { sender: "bot", text: botReply };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        },
        onError: () => {
          // Handle error by adding an error message to the local state
          const errorMessage = {
            sender: "bot",
            text: "Oops! Something went wrong. Please try again.",
          };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        },
      })
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(newMessage);
    }
  };

  const handleCloseChat = () => {
    setShowConfirmation(true); // Show the confirmation popup
  };

  const handleConfirmClose = () => {
    // Save chat history and clear messages
    if (sessionId && messages.length > 0) {
      dispatch(saveChatHistory({ sessionId, messages }));
    }
    setMessages([]); // Clear local messages
    setShowConfirmation(false); // Close the confirmation popup
    onClose(); // Close the chatbox
  };

  const handleCancelClose = () => {
    setShowConfirmation(false); // Close the confirmation popup
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 30,
        width: 350,
        height: 500,
        backgroundColor: "primary.main",
        boxShadow: 8,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 1300,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "primary.main",
          color: "primary.contrastText",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Chatbot
        </Typography>
        <IconButton size="small" onClick={handleCloseChat}>
          <CloseIcon sx={{ color: "primary.contrastText" }} />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                p: 1.5,
                borderRadius: 2,
                backgroundColor:
                  msg.sender === "user" ? "primary.light" : "grey.300",
                color: "text.primary",
                boxShadow: 2,
              }}
            >
              <Typography
                variant="body2"
                color={msg.sender === "user" ? "white" : "primary.main"}
              >
                {msg.text}
              </Typography>
            </Box>
          </Box>
        ))}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "grey.300",
                color: "text.primary",
                boxShadow: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", opacity: 0.7 }}
              >
                Uheal is typing...
              </Typography>
            </Box>
          </Box>
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Suggestions Area */}
      {suggestions.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #ccc",
            backgroundColor: "background.default",
            display: "flex",
            gap: 1,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {suggestions.map((suggestion, idx) => (
            <Button
              key={idx}
              variant="outlined"
              onClick={() => handleSendMessage(suggestion)}
              sx={{
                borderRadius: 20,
                textTransform: "none",
                fontSize: "0.875rem",
                padding: "6px 12px",
                minWidth: "80px",
              }}
            >
              {suggestion}
            </Button>
          ))}
        </Box>
      )}

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #ccc",
          display: "flex",
          gap: 1,
          alignItems: "center",
          backgroundColor: "primary.main",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          inputRef={inputRef} // Attach the ref to the TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 20,
            },
          }}
        />

        <SendIcon
          sx={{
            color: "primary.contrastText",
            cursor: "pointer",
            fontSize: 20,
          }}
          onClick={() => handleSendMessage(newMessage)}
          disabled={loading || !newMessage.trim()}
        />
      </Box>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1400,
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.default",
              boxShadow: 8,
              borderRadius: 2,
              p: 3,
              width: "80%",
              maxWidth: 300,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ mb: 2 }}>
              Are you sure you want to end the conversation? All messages will
              be cleared.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancelClose}
                sx={{
                  borderRadius: 20,
                  textTransform: "none",
                  fontSize: "0.675rem",
                  padding: "6px 12px",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmClose}
                sx={{
                  borderRadius: 20,
                  textTransform: "none",
                  fontSize: "0.675rem",
                  padding: "6px 12px",
                }}
              >
                End Conversation
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatBox;
