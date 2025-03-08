/**
 * @fileoverview Defines the application's route configurations.
 * Contains both public and private routes, along with header navigation links.
 */

import { lazy } from "react";

// Public Routes
/** @constant {React.LazyExoticComponent<React.ComponentType>} */
const Login = lazy(() => import("../components/public/auth/Login"));
const Signup = lazy(() => import("../components/public/auth/Signup"));
const PublicAboutUs = lazy(() => import("../components/public/AboutUs"));
const ContactUs = lazy(() => import("../components/public/ContactUs"));

// Private Routes
const Home = lazy(() => import("../components/private/Home"));
const Dashboard = lazy(() => import("../components/private/Dashboard"));
const Onboarding = lazy(() => import("../components/private/onBoarding"));
const DoctorDashboard = lazy(() =>
  import("../components/private/Dashboard/DoctorDashboard")
);
const AdminDashboard = lazy(() =>
  import("../components/private/Dashboard/AdminDashboard")
);

/**
 * List of private routes accessible only to authenticated users.
 * @constant {Array<{path: string, component: React.ComponentType, exact: boolean}>}
 */
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
    path: "/docprofile",
    component: DoctorDashboard,
    exact: true,
  },

  {
    path: "/daboutus",
    component:PublicAboutUs,
    exact: true,
  },
];

/**
 * List of public routes accessible without authentication.
 * @constant {Array<{path: string, component: React.ComponentType, exact: boolean}>}
 */
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

/**
 * Routes used in the navigation header.
 * @constant {Array<{path: string, name: string}>}
 */
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
