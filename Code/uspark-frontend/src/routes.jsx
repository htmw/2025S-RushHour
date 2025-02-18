import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Questionnaire from "./components/PatientQue";
import { UserRoleProvider } from "./UerRoleContext";

const AppRoutes = () => {
  return (
    <UserRoleProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pat-dashboard" element={<Questionnaire />} />




      </Routes>
    </Router>
    </UserRoleProvider>
  );
};

export default AppRoutes;
