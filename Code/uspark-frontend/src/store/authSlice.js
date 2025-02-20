// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
const userPayload = localStorage.getItem("token")
  ? JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
  : {};

const initialState = {
  token: localStorage.getItem("token") || "",
  refToken: "",
  fullName: "",
  email: "",
  ...userPayload,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Set full user data
    setUserAuth: (state, action) => {
      const { token, email, fullName } = action.payload;

      state.token = token;
      state.email = email;
      state.fullName = fullName;

      localStorage.setItem("token", token); // Store token in localStorage
    },

    // ✅ Clear user data on logout
    logoutUser: (state) => {
      state.token = "";
      state.refToken = "";
      state.fullName = "";
      state.email = "";
      localStorage.removeItem("token");
    },
  },
});

export const { setUserAuth, logoutUser } = authSlice.actions;
export default authSlice.reducer;
