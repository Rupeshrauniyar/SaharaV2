import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import PatientDashboard from "../components/dashboard/PatientDashboard";
import DoctorDashboard from "../components/dashboard/DoctorDashboard";
import HospitalAdminDashboard from "../components/dashboard/HospitalAdminDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

const ROLE_VIEWS = {
  Patient: PatientDashboard,
  Doctor: DoctorDashboard,
  HospitalAdmin: HospitalAdminDashboard,
  Admin: AdminDashboard,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 mt-4 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const RoleView = ROLE_VIEWS[user.role] || PatientDashboard;

  return (
    <DashboardLayout user={user}>
      <RoleView user={user} />
    </DashboardLayout>
  );
};

export default Dashboard;
