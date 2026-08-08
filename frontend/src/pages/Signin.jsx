import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // INPUT HANDLER
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while user is typing
    if (error) {
      setError("");
    }
  };

  // ==========================================
  // REDIRECT USER BASED ON ROLE
  // ==========================================

  const redirectUser = (role) => {
    switch (role) {
      case "Patient":
        navigate("/dashboard");

        break;

      case "Doctor":
        navigate("/doctor/dashboard");

        break;

      case "HospitalAdmin":
        navigate("/hospital/dashboard");

        break;

      case "Admin":
        navigate("/admin/dashboard");

        break;

      default:
        navigate("/dashboard");
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // ==========================================
      // STORE AUTHENTICATION DATA
      // ==========================================

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
      // ==========================================
      // REDIRECT BASED ON BACKEND ROLE
      // ==========================================

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setError(err.message || "Something went wrong while signing in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ================================================= */}
      {/* LEFT SIDE - SAHARA BRANDING */}
      {/* ================================================= */}

      <div className="hidden lg:flex lg:w-[48%] bg-emerald-700 text-white relative overflow-hidden">
        {/* Decorative circles */}

        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-600 opacity-50" />

        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-800 opacity-40" />

        <div className="relative z-10 flex flex-col justify-between w-full p-14">
          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">✚</span>
            </div>

            <span className="text-3xl font-bold tracking-tight">Sahara</span>
          </div>

          {/* Main message */}

          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-100 text-sm mb-6">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              Healthcare support when it matters
            </div>

            <h1 className="text-5xl font-bold leading-[1.1]">
              Your health.
              <br />
              <span className="text-emerald-200">Our priority.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-emerald-100">
              Access doctors, hospitals, emergency assistance, appointments and
              blood support through one secure healthcare platform.
            </p>

            {/* Feature cards */}

            <div className="grid grid-cols-2 gap-4 mt-10">
              <Feature
                icon="🚨"
                title="Emergency"
                text="Get help when you need it."
              />

              <Feature
                icon="👨‍⚕️"
                title="Doctors"
                text="Connect with healthcare experts."
              />

              <Feature
                icon="🏥"
                title="Hospitals"
                text="Find nearby medical facilities."
              />

              <Feature
                icon="🩸"
                title="Blood Support"
                text="Find donors and blood resources."
              />
            </div>
          </div>

          {/* Footer */}

          <div className="text-sm text-emerald-200">
            © {new Date().getFullYear()} Sahara Healthcare
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* RIGHT SIDE - LOGIN */}
      {/* ================================================= */}

      <div className="w-full lg:w-[52%] flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}

          <div className="lg:hidden flex justify-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                ✚
              </div>

              <span className="text-2xl font-bold text-slate-900">Sahara</span>
            </div>
          </div>

          {/* Header */}

          <div className="text-center lg:text-left mb-9">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
              Welcome back
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              Sign in to Sahara
            </h2>

            <p className="text-slate-500 mt-3">
              Access your personalized healthcare dashboard.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                !
              </div>

              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login form */}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email address
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ✉
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔒
                </span>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Remember me */}

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />

                <span className="text-sm text-slate-600">Remember me</span>
              </label>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-300 text-white font-semibold transition-all shadow-lg shadow-emerald-600/20"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-slate-200 flex-1" />

            <span className="text-xs text-slate-400 uppercase tracking-wider">
              New to Sahara?
            </span>

            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Signup */}

          <Link
            to="/signup"
            className="w-full flex items-center justify-center py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition"
          >
            Create an account
          </Link>

          {/* Security note */}

          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-400">
            <span>🔐</span>

            <span>Your healthcare information is protected.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// FEATURE COMPONENT
// =====================================================

const Feature = ({ icon, title, text }) => {
  return (
    <div className="flex gap-3 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-sm">{title}</h3>

        <p className="text-xs text-emerald-100 mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

export default Signin;
