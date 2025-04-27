import {
  SAVE_CHAT_HISTORY_PENDING,
  SAVE_CHAT_HISTORY_SUCCESS,
  SAVE_CHAT_HISTORY_ERROR,
  START_CHAT_WITH_BOT_PENDING,
  START_CHAT_WITH_BOT_SUCCESS,
  START_CHAT_WITH_BOT_ERROR,
  SEND_MESSAGE_WITH_BOT_PENDING,
  SEND_MESSAGE_WITH_BOT_SUCCESS,
  SEND_MESSAGE_WITH_BOT_ERROR,
} from "../actions/types";

const initialState = {
  loading: false,
  sessionId: null,
  messages: [],
  error: null,
};

const chatHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_CHAT_WITH_BOT_PENDING:
    case SEND_MESSAGE_WITH_BOT_PENDING:
    case SAVE_CHAT_HISTORY_PENDING:
      return { ...state, loading: true, error: null };

    case START_CHAT_WITH_BOT_SUCCESS:
      return {
        ...state,
        loading: false,
        sessionId: action.payload.session_id,
        messages: [
          {
            sender: "bot",
            text: action.payload.reply || "Hello! How can I help you today?",
          },
        ],
      };

    case SEND_MESSAGE_WITH_BOT_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: [...state.messages, action.payload],
      };

    case SAVE_CHAT_HISTORY_SUCCESS:
      return { ...state, loading: false };

    case START_CHAT_WITH_BOT_ERROR:
    case SEND_MESSAGE_WITH_BOT_ERROR:
    case SAVE_CHAT_HISTORY_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default chatHistoryReducer;
