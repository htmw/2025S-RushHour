import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
import { reducer } from "./reducers";
import { watchUploadProfileImage } from "./sagas/ImageUsaga";


const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActionPaths: ["meta.navigate"], // Ignore non-serializable navigate
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);



export default store;
