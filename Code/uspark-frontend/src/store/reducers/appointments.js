/**
 * @file Redux reducer for managing appointments-related state.
 * Handles fetching patient/doctor appointments and loading states.
 *
 * @namespace store.reducers.appointmentsReducer
 * @memberof store.reducers
 */

import * as types from "../actions/types";

/**
 * Initial state for the appointments reducer.
 * @constant
 * @memberof store.reducers.appointmentsReducer
 * @type {Object}
 * @property {Array<Object>} data - Array of appointment records.
 * @property {boolean} loading - Indicates whether data is being fetched.
 * @property {string|null} error - Holds error message if the fetch fails.
 */
const initialState = {
    data: [],
    loading: false,
    error: null,
};

/**
 * Appointments reducer to handle appointment-related actions.
 *
 * @memberof store.reducers.appointmentsReducer
 * @function appointmentsReducer
 * @param {Object} state - The current Redux state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The type of action dispatched.
 * @param {any} [action.payload] - The data sent with the action.
 * @returns {Object} New state based on the action type.
 */
const appointmentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_APPOINTMENTS_PENDING:
            return { ...state, loading: true, error: null };

        case types.FETCH_APPOINTMENTS_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case types.FETCH_APPOINTMENTS_ERROR:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default appointmentsReducer;
