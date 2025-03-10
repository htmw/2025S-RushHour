/**
 * @file Redux Store Configuration
 *
 * Configures and initializes the Redux store with Saga middleware.
 *
 * @namespace store
 */

import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
import { reducer } from "./reducers";

/**
 * Creates Redux Saga middleware instance.
 *
 * @constant
 * @memberof store
 * @type {Object}
 */
const sagaMiddleware = createSagaMiddleware();

/**
 * Configures and creates the Redux store.
 *
 * - Uses Redux Toolkit's `configureStore` for setup.
 * - Disables Redux Thunk (as Saga is used instead).
 * - Configures middleware to ignore serialization checks for navigation.
 *
 * @constant
 * @memberof store
 * @type {Object}
 */
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable Redux Thunk
      serializableCheck: {
        ignoredActionPaths: ["meta.navigate"], // Ignore non-serializable paths
      },
    }).concat(sagaMiddleware),
});

/**
 * Runs the root Saga middleware to handle side effects.
 *
 * @function
 * @memberof store
 */
sagaMiddleware.run(rootSaga);

export default store;
