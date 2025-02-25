import authReducer from "./authReducer";
import dashboardReducer from "./dashboardReducer";
import onboardingReducer from "./onBoardingReducer";
import imgReducer from "./ImageUreducer"
export const reducer = {
  auth: authReducer,
  dashboard: dashboardReducer,
  onBoarding: onboardingReducer,
  img:imgReducer,
};
