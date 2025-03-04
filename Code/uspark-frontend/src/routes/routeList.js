import { lazy } from "react";

const Login = lazy(() => import("../components/auth/Login"));
const Signup = lazy(() => import("../components/auth/Signup"));
const Home = lazy(() => import("../components/Home"));
const Dashboard = lazy(() => import("../components/Dashboard/Dashboard"));
const Onboarding = lazy(() => import("../components/onBoarding"));
const PatientProfile = lazy(() => import("../components/Dashboard/PatientProfile"));
const DoctorProfile = lazy(() => import("../components/Dashboard/DoctorProfile"));
const AboutUs = lazy(() => import("../components/AboutUs"));
const AboutUsD = lazy(() => import("../components/AboutUsD"));

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
  {
    path: "/patprofile",
    component: PatientProfile,
    exact: true,
  },
  {
    path: "/docprofile",
    component: DoctorProfile,
    exact: true,
  },
  {
    path: "/aboutus",
    component: AboutUs,
    exact: true,
  },
  {
    path: "/daboutus",
    component: AboutUsD,
    exact: true,
  },

  {
    path: "/home",
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
