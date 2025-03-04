import authReducer from "./authReducer";
import dashboardReducer from "./dashboardReducer";
import onboardingReducer from "./onBoardingReducer";
import imgReducer from "./ImageUreducer";
import themeReducer from "./themeReducer";
export const reducer = {
  auth: authReducer,
  dashboard: dashboardReducer,
  onBoarding: onboardingReducer,
  img: imgReducer,
  theme: themeReducer,
};
