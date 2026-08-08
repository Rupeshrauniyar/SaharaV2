import StatCard from "./StatCard";
import QuickAction from "./QuickAction";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const bloodInventory = {
  "A+": 12,
  "A-": 4,
  "B+": 8,
  "B-": 3,
  "AB+": 2,
  "AB-": 1,
  "O+": 15,
  "O-": 6,
};

const recentAdmissions = [
  { id: 1, patient: "Raju Shrestha", ward: "General", bed: "G-104", time: "2h ago" },
  { id: 2, patient: "Sunita Magar", ward: "ICU", bed: "ICU-02", time: "4h ago" },
  { id: 3, patient: "Prakash Dahal", ward: "Emergency", bed: "E-07", time: "6h ago" },
];

const HospitalAdminDashboard = ({ user }) => {
  const totalBeds = 120;
  const availableBeds = 34;
  const occupancy = Math.round(((totalBeds - availableBeds) / totalBeds) * 100);

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <ServicePill icon="🚨" label="Emergency" active />
        <ServicePill icon="🚑" label="Ambulance" active />
        <ServicePill icon="🏥" label="Hospital Open" active />
      </div>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="🛏️" label="Bed Occupancy" value={`${occupancy}%`} trend={`${availableBeds} available`} />
        <StatCard icon="👨‍⚕️" label="Active Doctors" value="24" accent="blue" />
        <StatCard icon="🚑" label="Emergency Cases" value="7" accent="rose" trend="Today" trendUp={false} />
        <StatCard icon="🩸" label="Blood Units" value="51" accent="violet" />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Bed Status</h2>
            <p className="text-sm text-slate-500 mt-1">Real-time capacity across wards</p>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-4">
            <BedBlock label="General Beds" total={80} available={22} color="emerald" />
            <BedBlock label="ICU Beds" total={20} available={4} color="blue" />
            <BedBlock label="Emergency Beds" total={15} available={6} color="rose" />
            <BedBlock label="Pediatric Beds" total={5} available={2} color="violet" />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-slate-900 px-1">Quick Actions</h2>

          <QuickAction
            icon="🛏️"
            title="Update Bed Count"
            description="Adjust available beds by ward"
            to="/dashboard"
            variant="primary"
          />

          <QuickAction
            icon="👨‍⚕️"
            title="Manage Doctors"
            description="Add or remove hospital doctors"
            to="/doctor"
          />

          <QuickAction
            icon="🩸"
            title="Blood Inventory"
            description="Update blood stock levels"
            to="/blood-donor"
          />
        </section>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Blood Inventory</h2>
        </div>

        <div className="p-6 grid grid-cols-4 sm:grid-cols-8 gap-3">
          {bloodGroups.map((group) => (
            <div
              key={group}
              className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <p className="text-xs font-semibold text-slate-500">{group}</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{bloodInventory[group]}</p>
              <p className="text-[10px] text-slate-400">units</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Recent Admissions</h2>
          <span className="text-sm text-emerald-600 font-medium">View all</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentAdmissions.map((item) => (
            <div
              key={item.id}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.patient}</p>
                <p className="text-sm text-slate-500">
                  {item.ward} · Bed {item.bed}
                </p>
              </div>
              <span className="text-sm text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-violet-700 rounded-2xl p-6 text-white">
        <p className="text-violet-200 text-sm font-medium">Hospital Administrator</p>
        <p className="text-xl font-bold mt-1">{user.fullName}</p>
        <p className="text-violet-100 text-sm mt-2">{user.email}</p>
      </section>
    </div>
  );
};

const ServicePill = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
      active
        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
        : "bg-slate-50 border-slate-200 text-slate-500"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <div>
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-xs opacity-70">{active ? "Active" : "Inactive"}</p>
    </div>
  </div>
);

const BedBlock = ({ label, total, available, color }) => {
  const used = total - available;
  const percent = Math.round((used / total) * 100);

  const barColors = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    rose: "bg-rose-500",
    violet: "bg-violet-500",
  };

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-slate-900 text-sm">{label}</p>
        <p className="text-xs text-slate-500">{available}/{total} free</p>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColors[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-2">{percent}% occupied</p>
    </div>
  );
};

export default HospitalAdminDashboard;
