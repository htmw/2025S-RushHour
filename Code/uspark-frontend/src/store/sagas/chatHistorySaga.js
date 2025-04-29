import { call, put, takeLatest } from "redux-saga/effects";
import {
  saveChatHistoryApi,
  startChatWithBotApi,
  sendMessageWithBotApi,
} from "../apis";
import {
  saveChatHistory,
  startChatWithBot,
  sendMessageWithBot,
} from "../actions";
import {
  SAVE_CHAT_HISTORY,
  START_CHAT_WITH_BOT,
  SEND_MESSAGE_WITH_BOT,
} from "../actions/types";

function* saveChatHistorySaga(action) {
  try {
    yield put(saveChatHistory.pending());
    const { sessionId, messages } = action.payload;
    const response = yield call(
      saveChatHistoryApi,
      localStorage.getItem("token"),
      {
        sessionId,
        messages,
      }
    );
    yield put(saveChatHistory.success(response.data));
  } catch (error) {
    yield put(saveChatHistory.error(error.message));
  }
}

function* startChatSaga() {
  try {
    yield put(startChatWithBot.pending());
    const response = yield call(startChatWithBotApi);
    yield put(startChatWithBot.success(response.data));
  } catch (error) {
    yield put(startChatWithBot.error(error.message));
  }
}

function* sendMessageSaga(action) {
  try {
    yield put(sendMessageWithBot.pending());
    const { sessionId, message } = action.payload;
    const response = yield call(sendMessageWithBotApi, sessionId, message);
    yield put(sendMessageWithBot.success(response.data));
  } catch (error) {
    yield put(sendMessageWithBot.error(error.message));
  }
}

function* watchSaveChatHistory() {
  yield takeLatest(SAVE_CHAT_HISTORY, saveChatHistorySaga);
  yield takeLatest(START_CHAT_WITH_BOT, startChatSaga);
  yield takeLatest(SEND_MESSAGE_WITH_BOT, sendMessageSaga);
}

export default watchSaveChatHistory;
