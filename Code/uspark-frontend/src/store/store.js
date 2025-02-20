import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import onBoardingReducer from "./onBoardingSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onBoardingReducer,
  },
});

export default store;
