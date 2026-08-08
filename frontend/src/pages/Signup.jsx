import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("Patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------
  // Common User Fields
  // -----------------------------
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    bloodGroup: "",
  });

  // -----------------------------
  // Doctor Fields
  // -----------------------------
  const [doctorData, setDoctorData] = useState({
    hospital: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    availableDays: [],
    startTime: "",
    endTime: "",
    isAvailable: true,
    bio: "",
  });

  // -----------------------------
  // Hospital Fields
  // -----------------------------
  const [hospitalData, setHospitalData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    longitude: "",
    latitude: "",
    departments: "",
    totalBeds: 0,
    availableBeds: 0,
    icuBeds: 0,
    emergencyBeds: 0,
    emergencyAvailable: true,
    ambulanceAvailable: false,
    isOpen: true,
  });

  // -----------------------------
  // Common input handler
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // Doctor input handler
  // -----------------------------
  const handleDoctorChange = (e) => {
    const { name, value } = e.target;

    setDoctorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // Hospital input handler
  // -----------------------------
  const handleHospitalChange = (e) => {
    const { name, value } = e.target;

    setHospitalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // Available days
  // -----------------------------
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const toggleDay = (day) => {
    setDoctorData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((item) => item !== day)
        : [...prev.availableDays, day],
    }));
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,

        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        bloodGroup: formData.bloodGroup,
      };

      // -----------------------------
      // Doctor payload
      // -----------------------------
      if (role === "Doctor") {
        payload.doctorData = {
          specialization: doctorData.specialization,
          qualification: doctorData.qualification,
          experience: Number(doctorData.experience),
          consultationFee: Number(doctorData.consultationFee),
          availableDays: doctorData.availableDays,

          availableTime: {
            start: doctorData.startTime,
            end: doctorData.endTime,
          },

          isAvailable: doctorData.isAvailable,
          bio: doctorData.bio,
        };

        if (doctorData.hospital?.trim()) {
          payload.doctorData.hospital = doctorData.hospital.trim();
        }
      }

      // -----------------------------
      // Hospital payload
      // -----------------------------
      if (role === "Hospital") {
        payload.role = "HospitalAdmin";

        payload.hospitalData = {
          name: hospitalData.name,
          description: hospitalData.description,
          phone: hospitalData.phone,
          email: hospitalData.email,
          website: hospitalData.website,
          address: hospitalData.address,
          city: hospitalData.city,

          location: {
            type: "Point",
            coordinates: [
              Number(hospitalData.longitude),
              Number(hospitalData.latitude),
            ],
          },

          departments: hospitalData.departments
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          beds: {
            total: Number(hospitalData.totalBeds),
            available: Number(hospitalData.availableBeds),
            icu: Number(hospitalData.icuBeds),
            emergency: Number(hospitalData.emergencyBeds),
          },

          emergencyAvailable: hospitalData.emergencyAvailable,
          ambulanceAvailable: hospitalData.ambulanceAvailable,
          isOpen: hospitalData.isOpen,
        };
      }

      const response = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      // Save authentication information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Registration successful! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* ========================================= */}
        {/* LEFT SIDE */}
        {/* ========================================= */}

        <div className="hidden lg:flex bg-emerald-700 text-white p-12 flex-col justify-between">

          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <span className="text-2xl">✚</span>
              </div>

              <h1 className="text-3xl font-bold">
                Sahara
              </h1>
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Healthcare help,
              <br />
              when you need it most.
            </h2>

            <p className="mt-6 text-emerald-100 text-lg leading-relaxed">
              Join Sahara and connect with doctors, hospitals,
              emergency services and healthcare resources from
              one platform.
            </p>
          </div>

          <div className="space-y-5">

            <Feature
              icon="🚨"
              title="Emergency Assistance"
              description="Get help quickly during critical situations."
            />

            <Feature
              icon="👨‍⚕️"
              title="Find Doctors"
              description="Connect with healthcare professionals."
            />

            <Feature
              icon="🏥"
              title="Nearby Hospitals"
              description="Find hospitals and emergency facilities."
            />

            <Feature
              icon="🩸"
              title="Blood Support"
              description="Connect donors with people who need blood."
            />

          </div>
        </div>

        {/* ========================================= */}
        {/* RIGHT SIDE */}
        {/* ========================================= */}

        <div className="p-6 sm:p-10 lg:p-12 max-h-[95vh] overflow-y-auto">

          <div className="mb-8">
            <p className="text-emerald-600 font-semibold text-sm">
              JOIN SAHARA
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              Create your account
            </h2>

            <p className="text-slate-500 mt-2">
              Choose your account type and enter your details.
            </p>
          </div>

          {/* ========================================= */}
          {/* ROLE SELECTOR */}
          {/* ========================================= */}

          <div className="grid grid-cols-3 gap-3 mb-8">

            <RoleButton
              active={role === "Patient"}
              icon="🧑"
              title="Patient"
              onClick={() => setRole("Patient")}
            />

            <RoleButton
              active={role === "Doctor"}
              icon="👨‍⚕️"
              title="Doctor"
              onClick={() => setRole("Doctor")}
            />

            <RoleButton
              active={role === "Hospital"}
              icon="🏥"
              title="Hospital"
              onClick={() => setRole("Hospital")}
            />

          </div>

          {/* ========================================= */}
          {/* ALERTS */}
          {/* ========================================= */}

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ========================================= */}
            {/* BASIC USER INFORMATION */}
            {/* ========================================= */}

            <section>
              <SectionTitle title="Personal Information" />

              <div className="grid sm:grid-cols-2 gap-5">

                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+977 98XXXXXXXX"
                  required
                />

                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />

                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    ["", "Select gender"],
                    ["Male", "Male"],
                    ["Female", "Female"],
                    ["Other", "Other"],
                  ]}
                />

                <Select
                  label="Blood Group"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  options={[
                    ["", "Select blood group"],
                    ["A+", "A+"],
                    ["A-", "A-"],
                    ["B+", "B+"],
                    ["B-", "B-"],
                    ["AB+", "AB+"],
                    ["AB-", "AB-"],
                    ["O+", "O+"],
                    ["O-", "O-"],
                  ]}
                />

              </div>

              <div className="mt-5">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>

              <div className="mt-5">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>
            </section>

            {/* ========================================= */}
            {/* PASSWORD */}
            {/* ========================================= */}

            <section>
              <SectionTitle title="Security" />

              <div className="grid sm:grid-cols-2 gap-5">

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  required
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                />

              </div>
            </section>

            {/* ========================================= */}
            {/* DOCTOR INFORMATION */}
            {/* ========================================= */}

            {role === "Doctor" && (
              <DoctorForm
                data={doctorData}
                onChange={handleDoctorChange}
                days={days}
                toggleDay={toggleDay}
              />
            )}

            {/* ========================================= */}
            {/* HOSPITAL INFORMATION */}
            {/* ========================================= */}

            {role === "Hospital" && (
              <HospitalForm
                data={hospitalData}
                onChange={handleHospitalChange}
              />
            )}

            {/* ========================================= */}
            {/* SUBMIT */}
            {/* ========================================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
            >
              {loading
                ? "Creating Account..."
                : `Create ${role} Account`}
            </button>

          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};


/* ===================================================== */
/* REUSABLE COMPONENTS */
/* ===================================================== */

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
      />
    </div>
  );
};


const Select = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};


const RoleButton = ({
  active,
  icon,
  title,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all ${
        active
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "border-slate-200 hover:border-emerald-200 bg-white"
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>

      <div className="font-semibold text-sm">
        {title}
      </div>
    </button>
  );
};


const SectionTitle = ({ title }) => {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h3 className="font-bold text-lg text-slate-900 whitespace-nowrap">
        {title}
      </h3>

      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
};


const Feature = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex gap-4">
      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="text-sm text-emerald-100 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};


/* ===================================================== */
/* DOCTOR FORM */
/* ===================================================== */

const DoctorForm = ({
  data,
  onChange,
  days,
  toggleDay,
}) => {
  return (
    <section>
      <SectionTitle title="Doctor Information" />

      <div className="space-y-5">

        <Input
          label="Hospital (optional)"
          name="hospital"
          value={data.hospital}
          onChange={onChange}
          placeholder="Link to a hospital later, or enter hospital ID"
        />

        <div className="grid sm:grid-cols-2 gap-5">

          <Input
            label="Specialization"
            name="specialization"
            value={data.specialization}
            onChange={onChange}
            placeholder="e.g. Cardiologist"
            required
          />

          <Input
            label="Qualification"
            name="qualification"
            value={data.qualification}
            onChange={onChange}
            placeholder="e.g. MBBS, MD"
            required
          />

          <Input
            label="Experience (Years)"
            name="experience"
            type="number"
            value={data.experience}
            onChange={onChange}
            placeholder="5"
            required
          />

          <Input
            label="Consultation Fee"
            name="consultationFee"
            type="number"
            value={data.consultationFee}
            onChange={onChange}
            placeholder="500"
            required
          />

        </div>

        {/* Available Days */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Available Days
          </label>

          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-2 rounded-lg text-sm border transition ${
                  data.availableDays.includes(day)
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Available Time */}
        <div className="grid sm:grid-cols-2 gap-5">

          <Input
            label="Available From"
            name="startTime"
            type="time"
            value={data.startTime}
            onChange={onChange}
          />

          <Input
            label="Available Until"
            name="endTime"
            type="time"
            value={data.endTime}
            onChange={onChange}
          />

        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Professional Bio
          </label>

          <textarea
            name="bio"
            value={data.bio}
            onChange={onChange}
            rows="4"
            maxLength="1000"
            placeholder="Tell patients about your experience..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition resize-none"
          />
        </div>

      </div>
    </section>
  );
};


/* ===================================================== */
/* HOSPITAL FORM */
/* ===================================================== */

const HospitalForm = ({
  data,
  onChange,
}) => {
  return (
    <section>
      <SectionTitle title="Hospital Information" />

      <div className="space-y-5">

        <Input
          label="Hospital Name"
          name="name"
          value={data.name}
          onChange={onChange}
          placeholder="e.g. Sahara City Hospital"
          required
        />

        <div className="grid sm:grid-cols-2 gap-5">

          <Input
            label="Hospital Phone"
            name="phone"
            value={data.phone}
            onChange={onChange}
            placeholder="+977 98XXXXXXXX"
            required
          />

          <Input
            label="Hospital Email"
            name="email"
            type="email"
            value={data.email}
            onChange={onChange}
            placeholder="hospital@example.com"
            required
          />

        </div>

        <Input
          label="Website"
          name="website"
          value={data.website}
          onChange={onChange}
          placeholder="https://example.com"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={data.description}
            onChange={onChange}
            rows="3"
            maxLength="1000"
            placeholder="Describe your hospital..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition resize-none"
          />
        </div>

        <Input
          label="Hospital Address"
          name="address"
          value={data.address}
          onChange={onChange}
          placeholder="Full hospital address"
          required
        />

        <Input
          label="City"
          name="city"
          value={data.city}
          onChange={onChange}
          placeholder="e.g. Dharan"
          required
        />

        {/* Coordinates */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Hospital Location
          </label>

          <div className="grid sm:grid-cols-2 gap-5">

            <Input
              label="Longitude"
              name="longitude"
              type="number"
              value={data.longitude}
              onChange={onChange}
              placeholder="e.g. 87.2833"
              required
            />

            <Input
              label="Latitude"
              name="latitude"
              type="number"
              value={data.latitude}
              onChange={onChange}
              placeholder="e.g. 26.8065"
              required
            />

          </div>

          <p className="text-xs text-slate-400 mt-2">
            Coordinates are stored as [longitude, latitude].
          </p>
        </div>

        {/* Departments */}
        <Input
          label="Departments"
          name="departments"
          value={data.departments}
          onChange={onChange}
          placeholder="Cardiology, Emergency, Orthopedics"
        />

        <p className="text-xs text-slate-400 -mt-3">
          Separate departments with commas.
        </p>

        {/* Beds */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Bed Information
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            <Input
              label="Total"
              name="totalBeds"
              type="number"
              value={data.totalBeds}
              onChange={onChange}
            />

            <Input
              label="Available"
              name="availableBeds"
              type="number"
              value={data.availableBeds}
              onChange={onChange}
            />

            <Input
              label="ICU"
              name="icuBeds"
              type="number"
              value={data.icuBeds}
              onChange={onChange}
            />

            <Input
              label="Emergency"
              name="emergencyBeds"
              type="number"
              value={data.emergencyBeds}
              onChange={onChange}
            />

          </div>
        </div>

        {/* Hospital Services */}
        <div className="grid sm:grid-cols-3 gap-4">

          <Toggle
            label="Emergency Available"
            checked={data.emergencyAvailable}
            onChange={(value) =>
              onChange({
                target: {
                  name: "emergencyAvailable",
                  value,
                },
              })
            }
          />

          <Toggle
            label="Ambulance Available"
            checked={data.ambulanceAvailable}
            onChange={(value) =>
              onChange({
                target: {
                  name: "ambulanceAvailable",
                  value,
                },
              })
            }
          />

          <Toggle
            label="Currently Open"
            checked={data.isOpen}
            onChange={(value) =>
              onChange({
                target: {
                  name: "isOpen",
                  value,
                },
              })
            }
          />

        </div>

      </div>
    </section>
  );
};


const Toggle = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">

      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition ${
          checked
            ? "bg-emerald-600"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </label>
  );
};

export default Signup;