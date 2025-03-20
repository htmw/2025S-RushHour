/**
 * @file Redux reducer for managing health issues state.
 * Handles fetching and adding health issues.
 *
 * @namespace store.reducers.healthIssuesReducer
 * @memberof store.reducers
 */
import * as types from "../actions/types";

/**
 * Initial state for the health issues reducer.
 * @constant
 * @memberof store.reducers.healthIssuesReducer
 * @type {Object}
 * @property {Array<Object>} healthIssues - List of health issues.
 * @property {boolean} loading - Indicates if a request is in progress.
 * @property {string|null} error - Stores error messages, if any.
 */
const initialState = {
  healthIssues: [],
  loading: false,
  error: null,
};

/**
 * Health issues reducer for handling fetching and adding health issues.
 *
 * @memberof store.reducers.healthIssuesReducer
 * @function healthIssuesReducer
 * @param {Object} state - The current health issues state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The action type.
 * @param {any} [action.payload] - The action payload containing health issues or errors.
 * @returns {Object} The updated health issues state.
 */
const healthIssuesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_HEALTH_ISSUES_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_HEALTH_ISSUES_SUCCESS:
      return { ...state, loading: false, healthIssues: action.payload };

    case types.FETCH_HEALTH_ISSUES_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.ADD_HEALTH_ISSUE_REQUEST:
      return { ...state, loading: true, error: null };

    case types.ADD_HEALTH_ISSUE_SUCCESS:
      return {
        ...state,
        loading: false,
        healthIssues: [...state.healthIssues, action.payload.newIssue],
      };

    case types.ADD_HEALTH_ISSUE_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default healthIssuesReducer;
