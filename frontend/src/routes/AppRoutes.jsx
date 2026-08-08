import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Doctor from "../pages/Doctor";
import BloodDonor from "../pages/BloodDonor";
import Appointment from "../pages/Appointment";
import Dashboard from "../pages/Dashboard";
import AiBot from "../pages/AiBot";
import BloodRequest from "../pages/BloodRequest";
import RoleLayout from "../components/dashboard/RoleLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<RoleLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/blood-donor" element={<BloodDonor />} />
        <Route path="/bloodRequest" element={<BloodRequest />} />
        <Route path="/ai-bot" element={<AiBot />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
