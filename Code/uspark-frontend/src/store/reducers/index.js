import authReducer from "./authReducer";
import dashboardReducer from "./dashboardReducer";
import onboardingReducer from "./onBoardingReducer";
import imgReducer from "./ImageUreducer";
import themeReducer from "./themeReducer";
import adminReducer from "./adminReducer";
export const reducer = {
  auth: authReducer,
  dashboard: dashboardReducer,
  onBoarding: onboardingReducer,
  img: imgReducer,
  theme: themeReducer,
  admin: adminReducer,
};
