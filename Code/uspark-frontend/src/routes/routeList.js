/**
 * @file Defines the application's route configurations.
 *
 * Contains both public and private routes, along with header navigation links.
 *
 * @namespace src.routes.routeList
 * @memberof src.routes
 */

import { lazy } from "react";



// Public Routes
/** @constant {React.LazyExoticComponent<React.ComponentType>} */
const Login = lazy(() => import("../components/public/auth/Login"));
const ForgotPassword = lazy(() =>
  import("../components/public/auth/ForgotPassword")
);
const ResetPassword = lazy(() =>
  import("../components/public/auth/ResetPassword")
);
const Appointments = lazy(() => import("../components/private/Dashboard/Appointments"));
const Signup = lazy(() => import("../components/public/auth/Signup"));
const PublicAboutUs = lazy(() => import("../components/public/AboutUs"));
const ContactUs = lazy(() => import("../components/public/ContactUs"));

// Private Routes
const Home = lazy(() => import("../components/private/Home"));
const Dashboard = lazy(() => import("../components/private/Dashboard"));
const Onboarding = lazy(() => import("../components/private/onBoarding"));
const ProfilePage = lazy(() => import("../components/private/Profile"));
const AdminDashboard = lazy(() =>
  import("../components/private/Dashboard/AdminDashboard")
);
const Admin = lazy(() =>
  import("../components/private/Dashboard/AdminDashboard")
);
const MakeAppointments = lazy(() => import("../components/private/Dashboard/MakeAppointments"));
const DoctorManagePatients = lazy(() => import("../components/private/DoctorPatient/DoctorManagePatients"));

/**
 * List of private routes accessible only to authenticated users.
 *
 * @constant
 * @memberof src.routes.routeList
 * @property {Array<{path: string, component: React.ComponentType, exact: boolean}>}
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
    path: "/profile",
    component: ProfilePage,
    exact: true,
  },
  {
    path: "/admin",
    component: Admin,
    exact: true,
  },
  {
    path: "/appointments",
    component: Appointments,
    exact: true,
  },

  {
    path: "/findahosp",
    component: MakeAppointments,
    exact: true,
  },
  {
    path: "/my-patients",
    component: DoctorManagePatients,
    exact: true,

  }
];

/**
 * List of public routes accessible without authentication.
 *
 * @constant
 * @memberof src.routes.routeList
 * @property {Array<{path: string, component: React.ComponentType, exact: boolean}>}
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
    path: "/forgot-password",
    component: ForgotPassword,
    exact: true,
  },
  {
    path: "/reset-password",
    component: ResetPassword,
    exact: true,
  },
  {
    path: "/aboutus",
    component: PublicAboutUs,
    exact: true,
  },
  {
    path: "/daboutus",
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
 *
 * @constant
 * @memberof src.routes.routeList
 * @property {Array<{path: string, name: string}>}
 */
export const publicHeaderRouteList = [
  {
    path: "/aboutus",
    name: "About Us",
  },
  {
    path: "/contactus",
    name: "Contact Us",
  },
];

/**
 * Routes used in the navigation header.
 *
 * @constant
 * @memberof src.routes.routeList
 * @property {Array<{path: string, name: string}>}
 */
export const patientRouteList = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  {
    path: "/profile",
    name: "Profile",
  },
  {
    path: "/appointments",
    name: "Appointments",
  },
];

/**
 * Routes used in the navigation header.
 *
 * @constant
 * @memberof src.routes.routeList
 * @property {Array<{path: string, name: string}>}
 */
export const doctorRouteList = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  {
    path: "/profile",
    name: "Profile",
  },
  {
    path: "/my-patients",
    name: "My Patients",
  },
];
