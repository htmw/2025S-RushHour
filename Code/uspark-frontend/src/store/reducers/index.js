/**
 * @file Combines and exports all Redux reducers for the application.
 *
 * @namespace store.reducers
 * @memberof store
 */

import authReducer from "./authReducer";
import dashboardReducer from "./dashboardReducer";
import onboardingReducer from "./onBoardingReducer";
import imgReducer from "./ImageUrReader";
import themeReducer from "./themeReducer";
import adminReducer from "./adminReducer";
import healthIssuesReducer from "./healthIssuesReducer";
import forgotPasswordReducer from "./forgotPasswordReducer";

/**
 * Root reducer object containing all application reducers.
 * Used in Redux store configuration.
 *
 * @constant
 * @memberof store.reducers
 * @type {Object}
 * @property {Function} auth - Reducer handling authentication state.
 * @property {Function} dashboard - Reducer managing dashboard data.
 * @property {Function} onBoarding - Reducer handling user onboarding state.
 * @property {Function} img - Reducer handling image uploads.
 * @property {Function} theme - Reducer managing theme settings.
 * @property {Function} admin - Reducer managing admin-related actions.
 * @property {Function} healthIssues - Reducer handling health issues.
 * @property {Function} forgotPassword - Reducer handling forgot password actions.
 */
export const reducer = {
  auth: authReducer,
  dashboard: dashboardReducer,
  onBoarding: onboardingReducer,
  img: imgReducer,
  theme: themeReducer,
  admin: adminReducer,
  healthIssues: healthIssuesReducer,
  forgotPassword: forgotPasswordReducer,
};
