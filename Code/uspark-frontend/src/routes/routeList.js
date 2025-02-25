import { lazy } from "react";

const Login = lazy(() => import("../components/auth/Login"));
const Signup = lazy(() => import("../components/auth/Signup"));
const Home = lazy(() => import("../components/Home"));
const Dashboard = lazy(() => import("../components/Dashboard/Dashboard"));
const Onboarding = lazy(() => import("../components/onBoarding"));

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
