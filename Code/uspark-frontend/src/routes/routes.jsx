import {
  unstable_HistoryRouter as Router,
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
import history from "../history";
const PrivateRoute = ({ Component }) => {
  const token = useSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" />;
  return <Component />;
};

const PublicRoute = ({ Component }) => {
  const token = useSelector((state) => state.auth.token);
  console.log({ token });
  const isOnboarded = useSelector((state) => state.auth.isOnboarded);
  return token && !isOnboarded ? <Navigate to="/" /> : <Component />;
};

const AppRoutes = () => {
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
