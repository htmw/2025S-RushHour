import * as types from "./types";

/**
 * Reusable action creator for async actions (Pending, Success, Error).
 */
const createAsyncActions = (baseType) => {
  const action = (payload, navigate) => ({
    type: baseType,
    payload,
    meta: { navigate },
  });

  action.pending = (navigate) => ({
    type: `${baseType}_PENDING`,
    meta: { navigate },
  });

  action.success = (data, navigate) => ({
    type: `${baseType}_SUCCESS`,
    payload: data,
    meta: { navigate },
  });

  action.error = (error, navigate) => ({
    type: `${baseType}_ERROR`,
    payload: error,
    meta: { navigate },
  });

  return action;
};

/**
 * Async Actions
 */
export const fetchDashboard = createAsyncActions(types.FETCH_DASHBOARD);
export const fetchProfile = createAsyncActions(types.FETCH_PROFILE);
export const login = createAsyncActions(types.LOGIN);
export const oAuthLogin = createAsyncActions(types.OAUTH_LOGIN);
export const signup = createAsyncActions(types.SIGNUP);
export const oAuthSignup = createAsyncActions(types.OAUTH_SIGNUP);
export const doctorOnboarding = createAsyncActions(types.DOCTOR_ONBOARDING);
export const logoutUser = createAsyncActions(types.LOGOUT_USER);
export const patientOnboarding = createAsyncActions(types.PATIENT_ONBOARDING);
export const roleSelection = createAsyncActions(types.ROLE_SELECION);
export const uploadProfileImage = createAsyncActions(types.UPLOAD_PROFILE_IMAGE);
export const fetchProfileImage = createAsyncActions(types.FETCH_PROFILE_IMAGE);
export const setTheme = createAsyncActions(types.SET_THEME);
export const fetchDoctors = createAsyncActions(types.FETCH_DOCTORS);
export const verifyDoctor = createAsyncActions(types.VERIFY_DOCTOR);
export const uploadVerificationDocs = createAsyncActions(types.UPLOAD_VERIFICATION_DOCS);
export const fetchHealthIssues = createAsyncActions(types.FETCH_HEALTH_ISSUES);
export const addHealthIssue = createAsyncActions(types.ADD_HEALTH_ISSUE);
export const forgotPassword = createAsyncActions(types.FORGOT_PASSWORD);
export const createInsurance = createAsyncActions(types.CREATE_INSURANCE);
export const fetchInsurance = createAsyncActions(types.FETCH_INSURANCE);
export const updatePatientProfile = createAsyncActions(types.UPDATE_PATIENT_PROFILE);
export const updateDoctorProfile = createAsyncActions(types.UPDATE_DOCTOR_PROFILE);
export const createMedicalHistory = createAsyncActions(types.CREATE_MEDICAL_HISTORY);
export const fetchMedicalHistory = createAsyncActions(types.FETCH_MEDICAL_HISTORY);
export const fetchHospitals = createAsyncActions(types.FETCH_HOSPITALS);
export const fetchAppointments = createAsyncActions(types.FETCH_APPOINTMENTS);
export const createAppointment = createAsyncActions(types.CREATE_APPOINTMENT);
export const fetchDoctorAvailability = createAsyncActions(types.FETCH_DOCTOR_AVAILABILITY);
export const saveDoctorAvailability = createAsyncActions(types.SAVE_DOCTOR_AVAILABILITY);
export const updateDoctorAvailability = createAsyncActions(types.UPDATE_DOCTOR_AVAILABILITY);
export const fetchDoctorPatients = createAsyncActions(types.FETCH_DOCTOR_PATIENTS);
export const fetchDoctorPatientDetails = createAsyncActions(types.FETCH_DOCTOR_PATIENT_DETAILS);
export const adminDoctor = createAsyncActions(types.ADMIN_DOCTOR_API);

// ⭐⭐ NEWLY ADDED ⭐⭐
export const medsegUpload = createAsyncActions(types.MEDSEG_UPLOAD_API);

// For non-standard patterns
export const updateAppointment = (payload) => ({
  type: types.UPDATE_APPOINTMENT,
  payload,
});

export const deleteAppointment = (payload) => ({
  type: types.DELETE_APPOINTMENT,
  payload,
});
