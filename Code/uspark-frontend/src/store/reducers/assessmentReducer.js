import {
  FETCH_ASSESSMENTS_PENDING,
  FETCH_ASSESSMENTS_SUCCESS,
  FETCH_ASSESSMENTS_ERROR,
  DELETE_ASSESSMENT_PENDING,
  DELETE_ASSESSMENT_SUCCESS,
  DELETE_ASSESSMENT_ERROR,
} from "../actions/types";

const initialState = {
  loading: false,
  assessments: [],
  error: null,
};

const assessmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ASSESSMENTS_PENDING:
    case DELETE_ASSESSMENT_PENDING:
      return { ...state, loading: true, error: null };

    case FETCH_ASSESSMENTS_SUCCESS:
      return { ...state, loading: false, assessments: action.payload };

    case DELETE_ASSESSMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        assessments: state.assessments.filter(
          (assessment) => assessment._id !== action.payload
        ),
      };

    case FETCH_ASSESSMENTS_ERROR:
    case DELETE_ASSESSMENT_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default assessmentReducer;
