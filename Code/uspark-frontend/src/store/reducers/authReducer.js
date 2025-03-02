import * as types from "../actions/types";

const localStorageToken = localStorage.getItem("token");
const userPayload = localStorageToken
  ? JSON.parse(atob(localStorageToken.split(".")[1]))
  : {};
console.log({ userPayload });

const initialState = {
  token: localStorageToken,
  email: "",
  fullName: "",
  isOnboarded: false,
  loading: false,
  error: null,
  imageUrl: "",
  ...userPayload,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_PENDING:
      return { ...state, loading: true, error: null };

    case types.LOGIN_SUCCESS:
      return { ...state, ...action.payload, loading: false };

    case types.LOGIN_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.OAUTH_LOGIN_PENDING:
      return { ...state, loading: true, error: null };

    case types.OAUTH_LOGIN_SUCCESS:
      return { ...state, ...action.payload, loading: false };

    case types.OAUTH_LOGIN_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.SIGNUP_PENDING:
    case types.OAUTH_SIGNUP_PENDING:
      return { ...state, loading: true, error: null };

    case types.SIGNUP_SUCCESS:
    case types.OAUTH_SIGNUP_SUCCESS:
      return { ...state, ...action.payload, loading: false };

    case types.SIGNUP_ERROR:
    case types.OAUTH_SIGNUP_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.LOGOUT_USER:
      return {};

    default:
      return state;
  }
};

export default authReducer;
