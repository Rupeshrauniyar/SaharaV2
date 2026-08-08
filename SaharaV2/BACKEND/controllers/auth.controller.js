const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const UserModel = require("../models/User");
const DoctorModel = require("../models/Doctor");
const HospitalModel = require("../models/Hospital");

// =====================================================
// GENERATE JWT
// =====================================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
};

// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,

      profileImage,
      gender,
      dateOfBirth,
      address,
      city,
      location,

      // Blood information
      bloodGroup,
      availability,
      emergencyAvailable,
      lastDonationDate,
      totalDonations,
      remarks,

      // Role-specific information
      doctorData,
      hospitalData,
    } = req.body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, phone and password are required.",
      });
    }

    // =================================================
    // NORMALIZE DATA
    // =================================================

    const normalizedEmail = email.trim().toLowerCase();

    const normalizedPhone = phone.trim();

    // =================================================
    // VALIDATE ROLE
    // =================================================

    const allowedRoles = ["Patient", "Doctor", "HospitalAdmin"];

    const userRole = role || "Patient";

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    // =================================================
    // ADMIN CANNOT SELF REGISTER
    // =================================================

    if (userRole === "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be created through registration.",
      });
    }

    // =================================================
    // PASSWORD VALIDATION
    // =================================================

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // =================================================
    // CHECK EXISTING EMAIL
    // =================================================

    const existingEmail = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // =================================================
    // CHECK EXISTING PHONE
    // =================================================

    const existingPhone = await UserModel.findOne({
      phone: normalizedPhone,
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number is already registered.",
      });
    }

    // =================================================
    // ROLE-SPECIFIC VALIDATION
    // =================================================

    // -------------------------------------------------
    // DOCTOR
    // -------------------------------------------------

    if (userRole === "Doctor") {
      if (!doctorData) {
        return res.status(400).json({
          success: false,
          message: "Doctor information is required.",
        });
      }

      if (
        !doctorData.specialization ||
        !doctorData.qualification ||
        doctorData.experience === undefined ||
        doctorData.experience === null ||
        doctorData.experience === "" ||
        doctorData.consultationFee === undefined ||
        doctorData.consultationFee === null ||
        doctorData.consultationFee === ""
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Specialization, qualification, experience and consultation fee are required.",
        });
      }

      if (
        Number.isNaN(Number(doctorData.experience)) ||
        Number(doctorData.experience) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Experience must be a valid non-negative number.",
        });
      }

      if (
        Number.isNaN(Number(doctorData.consultationFee)) ||
        Number(doctorData.consultationFee) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Consultation fee must be a valid non-negative number.",
        });
      }

      // If doctor belongs to a hospital,
      // hospital must be a valid MongoDB ObjectId.

      if (doctorData.hospital) {
        if (!mongoose.Types.ObjectId.isValid(doctorData.hospital)) {
          return res.status(400).json({
            success: false,
            message: "Invalid hospital ID.",
          });
        }

        const hospital = await HospitalModel.findById(doctorData.hospital);

        if (!hospital) {
          return res.status(404).json({
            success: false,
            message: "Hospital not found.",
          });
        }
      }
    }

    // -------------------------------------------------
    // HOSPITAL ADMIN
    // -------------------------------------------------

    if (userRole === "HospitalAdmin") {
      if (!hospitalData) {
        return res.status(400).json({
          success: false,
          message: "Hospital information is required.",
        });
      }

      if (!hospitalData.name) {
        return res.status(400).json({
          success: false,
          message: "Hospital name is required.",
        });
      }

      if (!hospitalData.phone) {
        return res.status(400).json({
          success: false,
          message: "Hospital phone is required.",
        });
      }

      if (!hospitalData.email) {
        return res.status(400).json({
          success: false,
          message: "Hospital email is required.",
        });
      }

      if (!hospitalData.address) {
        return res.status(400).json({
          success: false,
          message: "Hospital address is required.",
        });
      }

      if (!hospitalData.city) {
        return res.status(400).json({
          success: false,
          message: "Hospital city is required.",
        });
      }
    }

    // =================================================
    // CREATE USER
    // =================================================

    /*
     * IMPORTANT:
     *
     * DO NOT bcrypt.hash(password) here if your
     * User model already has:
     *
     * userSchema.pre("save", ...)
     *
     * because that would hash the password twice.
     *
     * We pass the plain password here and the
     * User model hashes it automatically.
     */

    const user = await UserModel.create({
      fullName: fullName.trim(),

      email: normalizedEmail,

      phone: normalizedPhone,

      password,

      role: userRole,

      profileImage: profileImage || "",

      gender: gender || undefined,

      dateOfBirth: dateOfBirth || undefined,

      address: address || undefined,

      city: city || undefined,

      location: location || undefined,

      // Blood information
      bloodGroup: bloodGroup || undefined,

      availability: availability !== undefined ? availability : undefined,

      emergencyAvailable:
        emergencyAvailable !== undefined ? emergencyAvailable : undefined,

      lastDonationDate: lastDonationDate || undefined,

      totalDonations:
        totalDonations !== undefined ? Number(totalDonations) : undefined,

      remarks: remarks || undefined,
    });

    // =================================================
    // CREATE DOCTOR PROFILE
    // =================================================

    let doctor = null;

    if (userRole === "Doctor") {
      const doctorPayload = {
        user: user._id,

        // Your Doctor schema supports both
        // Hospital and Independent doctors.
        practiceType:
          doctorData.practiceType ||
          (doctorData.hospital ? "Hospital" : "Independent"),

        specialization: doctorData.specialization.trim(),

        qualification: doctorData.qualification.trim(),

        experience: Number(doctorData.experience),

        consultationFee: Number(doctorData.consultationFee),

        availableDays: Array.isArray(doctorData.availableDays)
          ? doctorData.availableDays
          : [],

        availableTime: doctorData.availableTime || {
          start: "",
          end: "",
        },

        isAvailable:
          doctorData.isAvailable !== undefined ? doctorData.isAvailable : true,

        bio: doctorData.bio || "",
      };

      // -------------------------------------------------
      // HOSPITAL DOCTOR
      // -------------------------------------------------

      if (doctorData.hospital) {
        doctorPayload.hospital = doctorData.hospital;

        doctorPayload.practiceType = "Hospital";
      }

      // -------------------------------------------------
      // VIRTUAL CONSULTATION FEE
      // -------------------------------------------------

      if (
        doctorData.virtualConsultationFee !== undefined &&
        doctorData.virtualConsultationFee !== null &&
        doctorData.virtualConsultationFee !== ""
      ) {
        doctorPayload.virtualConsultationFee = Number(
          doctorData.virtualConsultationFee,
        );
      }

      doctor = await DoctorModel.create(doctorPayload);
    }

    // =================================================
    // CREATE HOSPITAL PROFILE
    // =================================================

    let hospital = null;

    if (userRole === "HospitalAdmin") {
      /*
       * IMPORTANT FIX:
       *
       * Hospital schema uses:
       *
       * admin: ObjectId -> User
       *
       * NOT:
       *
       * user: user._id
       */

      hospital = await HospitalModel.create({
        admin: user._id,

        name: hospitalData.name.trim(),

        description: hospitalData.description || "",

        phone: hospitalData.phone.trim(),

        email: hospitalData.email.trim().toLowerCase(),

        website: hospitalData.website || "",

        address: hospitalData.address.trim(),

        city: hospitalData.city.trim(),

        location: hospitalData.location || undefined,

        departments: Array.isArray(hospitalData.departments)
          ? hospitalData.departments
          : [],

        beds: {
          total: Number(hospitalData.beds?.total || 0),

          available: Number(hospitalData.beds?.available || 0),

          icu: Number(hospitalData.beds?.icu || 0),

          emergency: Number(hospitalData.beds?.emergency || 0),
        },

        bloodInventory: {
          "A+": Number(hospitalData.bloodInventory?.["A+"] || 0),

          "A-": Number(hospitalData.bloodInventory?.["A-"] || 0),

          "B+": Number(hospitalData.bloodInventory?.["B+"] || 0),

          "B-": Number(hospitalData.bloodInventory?.["B-"] || 0),

          "AB+": Number(hospitalData.bloodInventory?.["AB+"] || 0),

          "AB-": Number(hospitalData.bloodInventory?.["AB-"] || 0),

          "O+": Number(hospitalData.bloodInventory?.["O+"] || 0),

          "O-": Number(hospitalData.bloodInventory?.["O-"] || 0),
        },

        emergencyAvailable:
          hospitalData.emergencyAvailable !== undefined
            ? hospitalData.emergencyAvailable
            : true,

        ambulanceAvailable:
          hospitalData.ambulanceAvailable !== undefined
            ? hospitalData.ambulanceAvailable
            : false,

        isOpen: hospitalData.isOpen !== undefined ? hospitalData.isOpen : true,
      });
    }

    // =================================================
    // GENERATE JWT
    // =================================================

    const token = generateToken(user);

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,

      message: "Registration successful.",

      token,

      user: {
        id: user._id,

        fullName: user.fullName,

        email: user.email,

        phone: user.phone,

        role: user.role,

        profileImage: user.profileImage,

        isVerified: user.isVerified,
      },

      // Role-specific profile
      profile:
        userRole === "Doctor"
          ? doctor
          : userRole === "HospitalAdmin"
            ? hospital
            : null,
    });
  } catch (err) {
    console.error("Registration Error:", err);

    // =================================================
    // DUPLICATE KEY ERROR
    // =================================================

    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern || {})[0];

      return res.status(409).json({
        success: false,

        message: `${duplicateField || "Field"} is already registered.`,
      });
    }

    // =================================================
    // VALIDATION ERROR
    // =================================================

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((error) => error.message);

      return res.status(400).json({
        success: false,

        message: messages.join(", "),
      });
    }

    // =================================================
    // DEFAULT ERROR
    // =================================================

    return res.status(500).json({
      success: false,

      message: "Something went wrong during registration.",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: "Email and password are required.",
      });
    }

    // =================================================
    // FIND USER
    // =================================================

    /*
     * password has select:false in User schema,
     * therefore explicitly include it.
     */

    const user = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "Invalid email or password.",
      });
    }

    // =================================================
    // CHECK ACCOUNT
    // =================================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,

        message: "Your account has been deactivated.",
      });
    }

    // =================================================
    // CHECK PASSWORD
    // =================================================

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,

        message: "Invalid email or password.",
      });
    }

    // =================================================
    // UPDATE LAST LOGIN
    // =================================================

    user.lastLogin = new Date();

    /*
     * This save will NOT hash the password again
     * because password has not been modified.
     */

    await user.save();

    // =================================================
    // GET ROLE PROFILE
    // =================================================

    let profile = null;

    if (user.role === "Doctor") {
      profile = await DoctorModel.findOne({
        user: user._id,
      }).populate("hospital", "name city address phone");
    }

    if (user.role === "HospitalAdmin") {
      profile = await HospitalModel.findOne({
        admin: user._id,
      });
    }

    // =================================================
    // GENERATE TOKEN
    // =================================================

    const token = generateToken(user);

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message: "Login successful.",

      token,

      user: {
        id: user._id,

        fullName: user.fullName,

        email: user.email,

        phone: user.phone,

        role: user.role,

        profileImage: user.profileImage,

        isVerified: user.isVerified,
      },

      profile,
    });
  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      success: false,

      message: "Something went wrong during login.",
    });
  }
};

// =====================================================
// CHECK CURRENT USER
// =====================================================

const checkUser = async (req, res) => {
  try {
    // -------------------------------------------------
    // AUTHENTICATION CHECK
    // -------------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,

        message: "Authentication required.",
      });
    }

    // -------------------------------------------------
    // GET USER
    // -------------------------------------------------

    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found.",
      });
    }

    // -------------------------------------------------
    // GET PROFILE
    // -------------------------------------------------

    let profile = null;

    if (user.role === "Doctor") {
      profile = await DoctorModel.findOne({
        user: user._id,
      }).populate("hospital", "name city address phone");
    }

    if (user.role === "HospitalAdmin") {
      profile = await HospitalModel.findOne({
        admin: user._id,
      });
    }

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      user,

      profile,
    });
  } catch (err) {
    console.error("Check User Error:", err);

    return res.status(500).json({
      success: false,

      message: "Something went wrong.",
    });
  }
};

// =====================================================
// LOGOUT
// =====================================================

/*
 * JWT is stateless.
 *
 * The frontend should remove the token from
 * localStorage/cookies.
 *
 * This endpoint exists mainly for a clean API design.
 */

const logout = async (req, res) => {
  return res.status(200).json({
    success: true,

    message: "Logged out successfully.",
  });
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  register,

  login,

  checkUser,

  logout,
};
