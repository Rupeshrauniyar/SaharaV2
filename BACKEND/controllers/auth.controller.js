const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

      // Blood donor information
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

    // -------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: "Full name, email, phone and password are required.",
      });
    }

    // -------------------------------------------------
    // VALIDATE ROLE
    // -------------------------------------------------

    const allowedRoles = ["Patient", "Doctor", "HospitalAdmin"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role.",
      });
    }

    const userRole = role || "Patient";

    // -------------------------------------------------
    // ADMIN SHOULD NOT BE SELF REGISTERED
    // -------------------------------------------------

    if (userRole === "Admin") {
      return res.status(403).json({
        message: "Admin accounts cannot be created through registration.",
      });
    }

    // -------------------------------------------------
    // PASSWORD VALIDATION
    // -------------------------------------------------

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    // -------------------------------------------------
    // CHECK EXISTING EMAIL
    // -------------------------------------------------

    const existingEmail = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    // -------------------------------------------------
    // CHECK EXISTING PHONE
    // -------------------------------------------------

    const existingPhone = await UserModel.findOne({
      phone,
    });

    if (existingPhone) {
      return res.status(409).json({
        message: "Phone number is already registered.",
      });
    }
    // -------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // -------------------------------------------------
    // CREATE USER
    // -------------------------------------------------

    const user = await UserModel.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password:hashedPassword,
      role: userRole,

      profileImage,
      gender,
      dateOfBirth,
      address,
      city,
      location,

      // Blood donor information
      bloodGroup,
      availability,
      emergencyAvailable,
      lastDonationDate,
      totalDonations,
      remarks,
    });

    // -------------------------------------------------
    // CREATE DOCTOR PROFILE
    // -------------------------------------------------

    if (userRole === "Doctor") {
      if (!doctorData) {
        // Delete user because doctor profile is required
        await UserModel.findByIdAndDelete(user._id);

        return res.status(400).json({
          message: "Doctor information is required.",
        });
      }

      const {
        hospital,
        specialization,
        qualification,
        experience,
        consultationFee,
        virtualConsultationFee,
        availableDays,
        availableTime,
        isAvailable,
        bio,
      } = doctorData;

      if (
        !specialization ||
        !qualification ||
        experience === undefined ||
        experience === null ||
        experience === "" ||
        consultationFee === undefined ||
        consultationFee === null ||
        consultationFee === ""
      ) {
        await UserModel.findByIdAndDelete(user._id);

        return res.status(400).json({
          message:
            "Specialization, qualification, experience and consultation fee are required.",
        });
      }

      const doctorPayload = {
        user: user._id,
        specialization,
        qualification,
        experience: Number(experience),
        consultationFee: Number(consultationFee),
        availableDays: availableDays || [],
        availableTime,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        bio,
      };

      if (
        virtualConsultationFee !== undefined &&
        virtualConsultationFee !== null &&
        virtualConsultationFee !== ""
      ) {
        doctorPayload.virtualConsultationFee = Number(virtualConsultationFee);
      }

      if (hospital) {
        const linkedHospital = await HospitalModel.findById(hospital);

        if (!linkedHospital) {
          await UserModel.findByIdAndDelete(user._id);

          return res.status(400).json({
            message: "Invalid hospital ID.",
          });
        }

        doctorPayload.hospital = hospital;
      }

      await DoctorModel.create(doctorPayload);
    }

    // -------------------------------------------------
    // CREATE HOSPITAL PROFILE
    // -------------------------------------------------

    if (userRole === "HospitalAdmin") {
      if (!hospitalData) {
        // Delete user because hospital information is required
        await UserModel.findByIdAndDelete(user._id);

        return res.status(400).json({
          message: "Hospital information is required.",
        });
      }

      await HospitalModel.create({
        user: user._id,

        ...hospitalData,
      });
    }

    // -------------------------------------------------
    // GENERATE JWT
    // -------------------------------------------------

    const token = generateToken(user);

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

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
    });
  } catch (err) {
    console.error("Registration Error:", err);

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

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Not found.",
      });
    }

    // -------------------------------------------------
    // CHECK ACCOUNT STATUS
    // -------------------------------------------------

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated.",
      });
    }

    // -------------------------------------------------
    // CHECK PASSWORD
    // -------------------------------------------------

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // -------------------------------------------------
    // UPDATE LAST LOGIN
    // -------------------------------------------------

    user.lastLogin = new Date();

    await user.save();

    // -------------------------------------------------
    // GENERATE TOKEN
    // -------------------------------------------------

    const token = generateToken(user);

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

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
    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,

      user,
    });
  } catch (err) {
    console.error("Check User Error:", err);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

module.exports = {
  register,
  login,
  checkUser,
};
