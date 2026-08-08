import StatCard from "./StatCard";
import QuickAction from "./QuickAction";

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sita Sharma",
    specialty: "Cardiologist",
    date: "Aug 12, 2026",
    time: "10:30 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    doctor: "Dr. Ram Thapa",
    specialty: "General Physician",
    date: "Aug 15, 2026",
    time: "2:00 PM",
    status: "Pending",
  },
];

const PatientDashboard = ({ user }) => {
  return (
    <div className="space-y-8">
      {!user.isVerified && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-900">Account not verified</p>
            <p className="text-sm text-amber-700 mt-1">
              Complete your profile verification to unlock all healthcare services.
            </p>
          </div>
        </div>
      )}

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Upcoming Appointments" value="2" trend="+1 this week" />
        <StatCard icon="💊" label="Active Prescriptions" value="3" accent="blue" />
        <StatCard icon="🏥" label="Hospitals Visited" value="1" accent="violet" />
        <StatCard
          icon="🩸"
          label="Blood Group"
          value={user.bloodGroup || "—"}
          accent="rose"
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Upcoming Appointments</h2>
            <span className="text-sm text-emerald-600 font-medium">View all</span>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingAppointments.map((appt) => (
              <div
                key={appt.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{appt.doctor}</p>
                  <p className="text-sm text-slate-500">{appt.specialty}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {appt.date} · {appt.time}
                  </p>
                </div>

                <span
                  className={`self-start sm:self-center text-xs font-semibold px-3 py-1 rounded-full ${
                    appt.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-slate-900 px-1">Quick Actions</h2>

          <QuickAction
            icon="📅"
            title="Book Appointment"
            description="Schedule a visit with a doctor"
            to="/appointment"
            variant="primary"
          />

          <QuickAction
            icon="👨‍⚕️"
            title="Find Doctors"
            description="Search by specialty or hospital"
            to="/doctor"
          />

          <QuickAction
            icon="🩸"
            title="Blood Support"
            description="Request blood or register as donor"
            to="/blood-donor"
          />

          <QuickAction
            icon="🚨"
            title="Emergency SOS"
            description="Get immediate help nearby"
            variant="danger"
            onClick={() => alert("Emergency services will be notified.")}
          />
        </section>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-4">Your Profile</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="Phone" value={user.phone} />
          <ProfileField label="City" value={user.city || "Not set"} />
          <ProfileField
            label="Verification"
            value={user.isVerified ? "Verified" : "Pending"}
            highlight={user.isVerified}
          />
        </div>
      </section>
    </div>
  );
};

const ProfileField = ({ label, value, highlight }) => (
  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
    <p
      className={`mt-1 font-semibold truncate ${
        highlight ? "text-emerald-700" : "text-slate-900"
      }`}
    >
      {value}
    </p>
  </div>
);

export default PatientDashboard;
