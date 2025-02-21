import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "./routeList";
import { Suspense } from "react";
import LoadingSpinner from "../components/Suspense";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
const PrivateRoute = ({ Component }) => {
  const token = useSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" />;
  return <Component />;
};

const PublicRoute = ({ Component }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? <Navigate to="/" /> : <Component />;
};

const AppRoutes = () => {
  return (
    <Router>
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
