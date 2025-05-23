/**
 * @file Manages application routing using React Router.
 *
 * Supports both private and public routes with authentication checks.
 *
 * @namespace src.routes
 * @memberof src
 */

import {
  unstable_HistoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "./routeList";
import { Suspense } from "react";
import LoadingSpinner from "../components/public/Suspense";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import history from "../history";
import { fetchDashboard } from "../store/actions";

/**
 * Private route wrapper.
 * Redirects unauthenticated users to the login page.
 *
 * @component
 * @memberof src.routes
 * @param {Object} props - Component props.
 * @param {React.ComponentType} props.Component - The component to render if authenticated.
 * @returns {JSX.Element} The protected route component or a redirect to login.
 */
const PrivateRoute = ({ Component }) => {
  /** @type {string|null} */
  const token = useSelector((state) => state.auth.token);

  if (!token) return <Navigate to="/login" />;
  return <Component />;
};

/**
 * Public route wrapper.
 * Redirects authenticated but non-onboarded users to the home page.
 *
 * @component
 * @memberof src.routes
 * @param {Object} props - Component props.
 * @param {React.ComponentType} props.Component - The component to render if allowed.
 * @returns {JSX.Element} The public route component or a redirect.
 */
const PublicRoute = ({ Component }) => {
  /** @type {string|null} */
  const token = useSelector((state) => state.auth.token);
  /** @type {boolean} */
  const isOnboarded = useSelector((state) => state.auth.isOnboarded);

  return token && !isOnboarded ? <Navigate to="/" /> : <Component />;
};

/**
 * Main application routing component.
 *
 * Handles public and private routes, authentication, and lazy loading.
 *
 * @component
 * @memberof src.routes
 * @returns {JSX.Element} The main routing structure with headers and footers.
 */
const AppRoutes = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  console.log("Token in AppRoutes:", token);

  if (token) {
    dispatch(fetchDashboard({ token }));
  }
  return (
    <Router history={history}>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {PublicRoutes.map(({ path, component: Component }, index) => (
            <Route
              key={index}
              path={path}
              element={<PublicRoute Component={Component} />}
            />
          ))}
          {PrivateRoutes.map(({ path, component: Component }, index) => (
            <Route
              key={index}
              path={path}
              element={<PrivateRoute Component={Component} />}
            />
          ))}
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default AppRoutes;
