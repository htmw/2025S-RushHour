import { lazy } from "react";

const Login = lazy(() => import("../components/auth/Login"));
const Signup = lazy(() => import("../components/auth/Signup"));
const Home = lazy(() => import("../components/Home"));
const Dashboard = lazy(() => import("../components/Dashboard/index"));
const Onboarding = lazy(() => import("../components/onBoarding/Onboarding"));

export const PrivateRoutes = [
  {
    path: "/",
    component: Onboarding,
    exact: true,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    exact: true,
  },
];

export const PublicRoutes = [
  {
    path: "/login",
    component: Login,
    exact: true,
  },
  {
    path: "/signup",
    component: Signup,
    exact: true,
  },
];

export const headerRouteList = [
  // {
  //   path: "/home",
  //   name: "Home",
  // },
];
