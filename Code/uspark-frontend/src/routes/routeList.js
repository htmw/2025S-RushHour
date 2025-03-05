import { lazy } from "react";

// Public Routes
const Login = lazy(() => import("../components/public/auth/Login"));
const Signup = lazy(() => import("../components/public/auth/Signup"));
const PublicAboutUs = lazy(() => import("../components/public/AboutUs"));
const ContactUs = lazy(() => import("../components/public/ContactUs"));

// Private Routes
const Home = lazy(() => import("../components/private/Home"));
const Dashboard = lazy(() => import("../components/private/Dashboard"));
const Onboarding = lazy(() => import("../components/private/onBoarding"));
const PatientDashboard = lazy(() =>
  import("../components/private/Dashboard/PatientDashboard")
);
const DoctorDashboard = lazy(() =>
  import("../components/private/Dashboard/DoctorDashboard")
);
const AdminDashboard = lazy(() =>
  import("../components/private/Dashboard/AdminDashboard")
);
export const PrivateRoutes = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/onboarding",
    component: Onboarding,
    exact: true,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    exact: true,
  },
  {
    path: "/admindashboard",
    component: AdminDashboard,
    exact: true,
  },
  {
    path: "/patprofile",
    component: PatientDashboard,
    exact: true,
  },
  {
    path: "/docprofile",
    component: DoctorDashboard,
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
  {
    path: "/aboutus",
    component: PublicAboutUs,
    exact: true,
  },
  {
    path: "/contactus",
    component: ContactUs,
    exact: true,
  },
];

export const headerRouteList = [
  {
    path: "/aboutus",
    name: "About Us",
  },
  {
    path: "/contactus",
    name: "Contact Us",
  },
];
