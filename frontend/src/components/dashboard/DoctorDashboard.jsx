import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "./StatCard";
import QuickAction from "./QuickAction";
import { apiRequest, formatDate } from "../../utils/api";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-emerald-50 text-emerald-700",
  Completed: "bg-blue-50 text-blue-700",
  InProgress: "bg-blue-50 text-blue-700",
  Waiting: "bg-amber-50 text-amber-700",
  Scheduled: "bg-slate-100 text-slate-600",
};

const DoctorDashboard = ({ user }) => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await apiRequest("/dashboard/overview");
        setOverview(data.overview);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const stats = overview?.stats;
  const profile = overview?.user || user;
  const doctorProfile = overview?.doctorProfile;
  const todaySchedule = overview?.todaySchedule || [];
  const weeklyCounts = overview?.weeklyCounts || [];
  const maxWeeklyCount = Math.max(...weeklyCounts.map((item) => item.count), 1);

  if (loading) {
    return <DashboardLoading label="Loading your schedule..." />;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!doctorProfile && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-800">
          Doctor profile not found. Complete your doctor registration to see full dashboard data.
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div>
          <p className="text-sm text-slate-500">Availability Status</p>
          <p className="font-bold text-slate-900 mt-1">
            {stats?.isAvailable
              ? "Accepting patients"
              : "Currently unavailable"}
          </p>
          {doctorProfile?.specialization && (
            <p className="text-sm text-slate-500 mt-1">{doctorProfile.specialization}</p>
          )}
        </div>

        <span
          className={`inline-flex self-start px-3 py-1.5 rounded-full text-xs font-semibold ${
            stats?.isAvailable
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {stats?.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="Patients Today"
          value={String(stats?.patientsToday ?? 0)}
          trend={`${stats?.pendingAppointments ?? 0} pending`}
        />
        <StatCard
          icon="📅"
          label="This Week"
          value={String(stats?.appointmentsThisWeek ?? 0)}
          accent="blue"
        />
        <StatCard
          icon="💻"
          label="Virtual Fee"
          value={`Rs. ${stats?.virtualConsultationFee ?? 0}`}
          accent="amber"
        />
        <StatCard
          icon="💰"
          label="Physical Fee"
          value={`Rs. ${stats?.consultationFee ?? 0}`}
          accent="violet"
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Today&apos;s Schedule</h2>
            <Link to="/appointment" className="text-sm text-emerald-600 font-medium">
              {todaySchedule.length} appointments
            </Link>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No appointments scheduled for today.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {todaySchedule.map((item) => (
                <div
                  key={item._id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                      {(item.patient?.fullName || "P")
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.patient?.fullName || "Patient"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDate(item.appointmentDate, true)} • {item.appointmentType}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-center text-xs font-semibold px-3 py-1 rounded-full ${
                      STATUS_STYLES[item.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-slate-900 px-1">Quick Actions</h2>

          <QuickAction
            icon="📋"
            title="View Appointments"
            description="Manage patient appointments"
            to="/appointment"
            variant="primary"
          />

          <QuickAction
            icon="🗓️"
            title="Today&apos;s Schedule"
            description="See all visits for today"
            to="/appointment"
          />

          <QuickAction
            icon="✦"
            title="AI Assistant"
            description="Clinical guidance and support"
            to="/ai-bot"
          />
        </section>
      </div>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-3">Weekly Overview</h3>
          <div className="flex items-end gap-2 h-24">
            {weeklyCounts.map((item) => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-emerald-500 rounded-t-md opacity-80"
                  style={{
                    height: `${Math.max((item.count / maxWeeklyCount) * 100, item.count ? 12 : 4)}%`,
                  }}
                />
                <span className="text-[10px] text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-700 rounded-2xl p-6 text-white">
          <p className="text-emerald-200 text-sm font-medium">Signed in as</p>
          <p className="text-xl font-bold mt-1">{profile.fullName}</p>
          <p className="text-emerald-100 text-sm mt-2">{profile.email}</p>
          {doctorProfile?.hospital?.name && (
            <p className="text-emerald-100 text-sm mt-2">{doctorProfile.hospital.name}</p>
          )}
          <p className="text-emerald-100/80 text-xs mt-4">
            {profile.isVerified
              ? "Your credentials are verified."
              : "Profile verification is pending review."}
          </p>
        </div>
      </section>
    </div>
  );
};

const DashboardLoading = ({ label }) => (
  <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center">
    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
    <p className="text-slate-500 mt-4 text-sm">{label}</p>
  </div>
);

export default DoctorDashboard;
