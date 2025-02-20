// src/store/onboardingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: "", // "patient" or "doctor"
  patientData: {},
  doctorData: {},
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    updatePatientData: (state, action) => {
      state.patientData = { ...state.patientData, ...action.payload };
    },
    updateDoctorData: (state, action) => {
      state.doctorData = { ...state.doctorData, ...action.payload };
    },
    clearOnboarding: (state) => {
      state.role = "";
      state.patientData = {};
      state.doctorData = {};
    },
  },
});

export const { setRole, updatePatientData, updateDoctorData, clearOnboarding } =
  onboardingSlice.actions;
export default onboardingSlice.reducer;
