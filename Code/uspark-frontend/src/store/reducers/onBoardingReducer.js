import * as types from "../actions/types";

const initialState = {
  doctorData: null,
  patientData: null,
  role: "",
  loading: false,
  error: null,
};

const onboardingReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DOCTOR_ONBOARDING_PENDING:
      return { ...state, loading: true, error: null };

    case types.DOCTOR_ONBOARDING_SUCCESS:
      return { ...state, loading: false, doctorData: action.payload };

    case types.DOCTOR_ONBOARDING_ERROR:
      return { ...state, loading: false, error: action.payload };
    case types.PATIENT_ONBOARDING_PENDING:
      return { ...state, loading: true, error: null };

    case types.PATIENT_ONBOARDING_SUCCESS:
      return { ...state, loading: false, patientData: action.payload };

    case types.ROLE_SELECION:
      return { ...state, loading: false, role: action.payload };

    default:
      return state;
  }
};

export default onboardingReducer;
