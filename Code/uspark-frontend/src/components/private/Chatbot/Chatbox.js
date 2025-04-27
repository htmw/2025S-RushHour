// src/components/private/Dashboard/ChatBoxStyles.js

export const chatBoxWrapper = {
  position: "fixed",
  bottom: 80,
  right: 30,
  width: 300,
  height: 400,
  backgroundColor: "background.paper",
  boxShadow: 6,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  zIndex: 1300,
};

export const chatBoxHeader = {
  backgroundColor: "primary.main",
  color: "primary.contrastText",
  px: 2,
  py: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const chatMessagesContainer = {
  flex: 1,
  p: 2,
  overflowY: "auto",
  backgroundColor: "background.default",
};

export const chatMessage = (sender) => ({
  display: "flex",
  justifyContent: sender === "user" ? "flex-end" : "flex-start",
  mb: 1,
});

export const chatBubble = (sender) => ({
  maxWidth: "70%",
  p: 1,
  borderRadius: 2,
  backgroundColor: sender === "user" ? "primary.light" : "grey.300",
  color: "text.primary",
});

export const chatInputContainer = {
  p: 2,
  borderTop: "1px solid #ccc",
  display: "flex",
  gap: 1,
  alignItems: "center",
};
