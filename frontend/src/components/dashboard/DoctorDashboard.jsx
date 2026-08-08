import { useState } from "react";
import StatCard from "./StatCard";
import QuickAction from "./QuickAction";

const todaySchedule = [
  { id: 1, patient: "Anita Gurung", time: "09:00 AM", type: "Follow-up", status: "Waiting" },
  { id: 2, patient: "Bikash Rai", time: "09:30 AM", type: "Consultation", status: "In progress" },
  { id: 3, patient: "Mina Karki", time: "10:00 AM", type: "New patient", status: "Scheduled" },
  { id: 4, patient: "Suresh Limbu", time: "10:30 AM", type: "Check-up", status: "Scheduled" },
];

const DoctorDashboard = ({ user }) => {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div>
          <p className="text-sm text-slate-500">Availability Status</p>
          <p className="font-bold text-slate-900 mt-1">
            {isAvailable ? "Accepting patients today" : "Currently unavailable"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAvailable((prev) => !prev)}
          className={`relative w-14 h-8 rounded-full transition shrink-0 ${
            isAvailable ? "bg-emerald-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition ${
              isAvailable ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="👥" label="Patients Today" value="12" trend="4 remaining" />
        <StatCard icon="📅" label="This Week" value="38" accent="blue" trend="+6 vs last week" />
        <StatCard icon="⭐" label="Rating" value="4.8" accent="amber" />
        <StatCard icon="💰" label="Consultation Fee" value="Rs. 500" accent="violet" />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Today&apos;s Schedule</h2>
            <span className="text-sm text-slate-500">{todaySchedule.length} appointments</span>
          </div>

          <div className="divide-y divide-slate-100">
            {todaySchedule.map((item) => (
              <div
                key={item.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                    {item.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.patient}</p>
                    <p className="text-sm text-slate-500">
                      {item.time} · {item.type}
                    </p>
                  </div>
                </div>

                <span
                  className={`self-start sm:self-center text-xs font-semibold px-3 py-1 rounded-full ${
                    item.status === "In progress"
                      ? "bg-blue-50 text-blue-700"
                      : item.status === "Waiting"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-slate-900 px-1">Quick Actions</h2>

          <QuickAction
            icon="📋"
            title="Patient Records"
            description="View and update medical history"
            to="/appointment"
            variant="primary"
          />

          <QuickAction
            icon="🗓️"
            title="Manage Schedule"
            description="Update available days and hours"
            to="/doctor"
          />

          <QuickAction
            icon="✏️"
            title="Edit Profile"
            description="Update specialization and bio"
            to="/doctor"
          />
        </section>
      </div>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-3">Weekly Overview</h3>
          <div className="flex items-end gap-2 h-24">
            {[40, 65, 55, 80, 70, 30, 20].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-emerald-500 rounded-t-md opacity-80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-slate-400">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-700 rounded-2xl p-6 text-white">
          <p className="text-emerald-200 text-sm font-medium">Signed in as</p>
          <p className="text-xl font-bold mt-1">{user.fullName}</p>
          <p className="text-emerald-100 text-sm mt-2">{user.email}</p>
          <p className="text-emerald-100/80 text-xs mt-4">
            {user.isVerified
              ? "Your credentials are verified."
              : "Profile verification is pending review."}
          </p>
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;
