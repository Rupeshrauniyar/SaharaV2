import { Link, useNavigate } from "react-router-dom";

const ROLE_CONFIG = {
  Patient: {
    label: "Patient",
    badge: "bg-emerald-100 text-emerald-800",
    nav: [
      { to: "/dashboard", label: "Overview", icon: "📊" },
      { to: "/appointment", label: "Appointments", icon: "📅" },
      { to: "/doctor", label: "Find Doctors", icon: "👨‍⚕️" },
      { to: "/blood-donor", label: "Blood Support", icon: "🩸" },
    ],
  },
  Doctor: {
    label: "Doctor",
    badge: "bg-blue-100 text-blue-800",
    nav: [
      { to: "/dashboard", label: "Overview", icon: "📊" },
      { to: "/appointment", label: "Appointments", icon: "📅" },
      { to: "/doctor", label: "My Profile", icon: "👨‍⚕️" },
    ],
  },
  HospitalAdmin: {
    label: "Hospital Admin",
    badge: "bg-violet-100 text-violet-800",
    nav: [
      { to: "/dashboard", label: "Overview", icon: "📊" },
      { to: "/appointment", label: "Appointments", icon: "📅" },
      { to: "/blood-donor", label: "Blood Inventory", icon: "🩸" },
    ],
  },
  Admin: {
    label: "Administrator",
    badge: "bg-amber-100 text-amber-800",
    nav: [
      { to: "/dashboard", label: "Overview", icon: "📊" },
      { to: "/doctor", label: "Doctors", icon: "👨‍⚕️" },
      { to: "/blood-donor", label: "Blood Network", icon: "🩸" },
    ],
  },
};

const DashboardLayout = ({ user, children }) => {
  const navigate = useNavigate();
  const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.Patient;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initials = user.fullName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 shrink-0">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg">
              ✚
            </div>
            <span className="text-xl font-bold text-slate-900">Sahara</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {config.nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors font-medium"
          >
            <span>🚪</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wide">
                Dashboard
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                Welcome back, {user.fullName?.split(" ")[0]}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full ${config.badge}`}
              >
                {config.label}
              </span>

              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
                {initials || "?"}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Sign out"
              >
                🚪
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <nav className="lg:hidden flex gap-2 mt-4 overflow-x-auto pb-1">
            {config.nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium whitespace-nowrap shrink-0"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
