const mongoose = require("mongoose");
const Hospital = require("../models/Hospital");

// ============================================================
// HELPERS
// ============================================================

const getUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId || null;
};

const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const getOwnedHospital = async (req, hospitalId) => {
  const userId = getUserId(req);

  if (!userId || !isValidId(hospitalId)) {
    return null;
  }

  return Hospital.findOne({
    _id: hospitalId,
    admin: userId,
  });
};

// ============================================================
// CREATE HOSPITAL
// ============================================================

const createHospital = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (req.user?.role !== "HospitalAdmin") {
      return res.status(403).json({
        success: false,
        message: "Only hospital administrators can create a hospital.",
      });
    }

    const {
      name,
      description,
      phone,
      email,
      website,
      address,
      city,
      departments,
      beds,
      bloodInventory,
      emergencyAvailable,
      ambulanceAvailable,
      isOpen,
    } = req.body;

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !email?.trim() ||
      !address?.trim() ||
      !city?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, email, address and city are required.",
      });
    }

    // Prevent duplicate hospital for same admin
    const existing = await Hospital.findOne({
      admin: userId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You already have a registered hospital.",
        hospital: existing,
      });
    }

    const hospital = await Hospital.create({
      admin: userId,

      name: name.trim(),

      description: description?.trim() || "",

      phone: phone.trim(),

      email: email.toLowerCase().trim(),

      website: website?.trim() || "",

      address: address.trim(),

      city: city.trim(),

      departments: Array.isArray(departments) ? departments : [],

      beds: {
        total: Number(beds?.total) || 0,
        available: Number(beds?.available) || 0,
        icu: Number(beds?.icu) || 0,
        emergency: Number(beds?.emergency) || 0,
      },

      bloodInventory: {
        "A+": Number(bloodInventory?.["A+"]) || 0,

        "A-": Number(bloodInventory?.["A-"]) || 0,

        "B+": Number(bloodInventory?.["B+"]) || 0,

        "B-": Number(bloodInventory?.["B-"]) || 0,

        "AB+": Number(bloodInventory?.["AB+"]) || 0,

        "AB-": Number(bloodInventory?.["AB-"]) || 0,

        "O+": Number(bloodInventory?.["O+"]) || 0,

        "O-": Number(bloodInventory?.["O-"]) || 0,
      },

      emergencyAvailable:
        typeof emergencyAvailable === "boolean" ? emergencyAvailable : true,

      ambulanceAvailable:
        typeof ambulanceAvailable === "boolean" ? ambulanceAvailable : false,

      isOpen: typeof isOpen === "boolean" ? isOpen : true,
    });

    return res.status(201).json({
      success: true,
      message: "Hospital registered successfully.",
      hospital,
    });
  } catch (error) {
    console.error("CREATE HOSPITAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the hospital.",
    });
  }
};

// ============================================================
// GET ALL HOSPITALS
// ============================================================

const getHospitals = async (req, res) => {
  try {
    const { city, emergencyOnly, ambulanceOnly, isOpen } = req.query;

    const filter = {};

    if (city?.trim()) {
      filter.city = new RegExp(`^${city.trim()}$`, "i");
    }

    if (emergencyOnly === "true") {
      filter.emergencyAvailable = true;
    }

    if (ambulanceOnly === "true") {
      filter.ambulanceAvailable = true;
    }

    if (isOpen === "true") {
      filter.isOpen = true;
    }

    const hospitals = await Hospital.find(filter)
      .populate("admin", "fullName email phone")
      .select("-__v")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });
  } catch (error) {
    console.error("GET HOSPITALS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching hospitals.",
    });
  }
};

// ============================================================
// GET MY HOSPITAL
// ============================================================

const getMyHospital = async (req, res) => {
  try {
    const userId = getUserId(req);

    console.log("GET MY HOSPITAL - USER:", userId);

    console.log("GET MY HOSPITAL - ROLE:", req.user?.role);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID was not found in authentication token.",
      });
    }

    const hospital = await Hospital.findOne({
      admin: userId,
    }).populate("admin", "fullName email phone");

    if (!hospital) {
      console.log("NO HOSPITAL FOUND FOR ADMIN:", userId);

      return res.status(404).json({
        success: false,
        message: "No hospital is linked to this account.",
        code: "HOSPITAL_NOT_LINKED",
        userId,
      });
    }

    return res.status(200).json({
      success: true,
      hospital,
    });
  } catch (error) {
    console.error("GET MY HOSPITAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching your hospital.",
    });
  }
};

// ============================================================
// GET HOSPITAL BY ID
// ============================================================

const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hospital ID.",
      });
    }

    const hospital = await Hospital.findById(id).populate(
      "admin",
      "fullName email phone",
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found.",
      });
    }

    return res.status(200).json({
      success: true,
      hospital,
    });
  } catch (error) {
    console.error("GET HOSPITAL BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the hospital.",
    });
  }
};

// ============================================================
// UPDATE HOSPITAL PROFILE
// ============================================================

const updateHospital = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hospital ID.",
      });
    }

    const hospital = await getOwnedHospital(req, id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found or you are not authorized.",
      });
    }

    const {
      name,
      description,
      phone,
      email,
      website,
      address,
      city,
      departments,
    } = req.body;

    if (name !== undefined) {
      hospital.name = name.trim();
    }

    if (description !== undefined) {
      hospital.description = description.trim();
    }

    if (phone !== undefined) {
      hospital.phone = phone.trim();
    }

    if (email !== undefined) {
      hospital.email = email.toLowerCase().trim();
    }

    if (website !== undefined) {
      hospital.website = website.trim();
    }

    if (address !== undefined) {
      hospital.address = address.trim();
    }

    if (city !== undefined) {
      hospital.city = city.trim();
    }

    if (departments !== undefined) {
      if (!Array.isArray(departments)) {
        return res.status(400).json({
          success: false,
          message: "Departments must be an array.",
        });
      }

      hospital.departments = departments;
    }

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Hospital profile updated successfully.",
      hospital,
    });
  } catch (error) {
    console.error("UPDATE HOSPITAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the hospital.",
    });
  }
};

// ============================================================
// UPDATE BEDS
// ============================================================

const updateBeds = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hospital ID.",
      });
    }

    const hospital = await getOwnedHospital(req, id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found or unauthorized.",
      });
    }

    const { total, available, icu, emergency } = req.body;

    const newTotal = total !== undefined ? Number(total) : hospital.beds.total;

    const newAvailable =
      available !== undefined ? Number(available) : hospital.beds.available;

    const newIcu = icu !== undefined ? Number(icu) : hospital.beds.icu;

    const newEmergency =
      emergency !== undefined ? Number(emergency) : hospital.beds.emergency;

    if (
      !Number.isInteger(newTotal) ||
      !Number.isInteger(newAvailable) ||
      !Number.isInteger(newIcu) ||
      !Number.isInteger(newEmergency)
    ) {
      return res.status(400).json({
        success: false,
        message: "Bed values must be whole numbers.",
      });
    }

    if (newTotal < 0 || newAvailable < 0 || newIcu < 0 || newEmergency < 0) {
      return res.status(400).json({
        success: false,
        message: "Bed values cannot be negative.",
      });
    }

    if (newAvailable > newTotal) {
      return res.status(400).json({
        success: false,
        message: "Available beds cannot exceed total beds.",
      });
    }

    if (newIcu > newTotal) {
      return res.status(400).json({
        success: false,
        message: "ICU beds cannot exceed total beds.",
      });
    }

    if (newEmergency > newTotal) {
      return res.status(400).json({
        success: false,
        message: "Emergency beds cannot exceed total beds.",
      });
    }

    hospital.beds = {
      total: newTotal,
      available: newAvailable,
      icu: newIcu,
      emergency: newEmergency,
    };

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Hospital bed information updated.",
      beds: hospital.beds,
    });
  } catch (error) {
    console.error("UPDATE BEDS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating beds.",
    });
  }
};

// ============================================================
// UPDATE BLOOD INVENTORY
// ============================================================

const updateBloodInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hospital ID.",
      });
    }

    const hospital = await getOwnedHospital(req, id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found or unauthorized.",
      });
    }

    const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    for (const group of groups) {
      if (req.body[group] !== undefined) {
        const value = Number(req.body[group]);

        if (!Number.isInteger(value) || value < 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid inventory value for ${group}.`,
          });
        }

        hospital.bloodInventory[group] = value;
      }
    }

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Blood inventory updated successfully.",
      bloodInventory: hospital.bloodInventory,
    });
  } catch (error) {
    console.error("UPDATE BLOOD INVENTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating blood inventory.",
    });
  }
};

// ============================================================
// UPDATE EMERGENCY
// ============================================================

const updateEmergencyStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await getOwnedHospital(req, id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found or unauthorized.",
      });
    }

    if (typeof req.body.emergencyAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "emergencyAvailable must be true or false.",
      });
    }

    hospital.emergencyAvailable = req.body.emergencyAvailable;

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Emergency availability updated.",
      emergencyAvailable: hospital.emergencyAvailable,
    });
  } catch (error) {
    console.error("UPDATE EMERGENCY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ============================================================
// UPDATE AMBULANCE
// ============================================================

const updateAmbulanceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await getOwnedHospital(req, id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found or unauthorized.",
      });
    }

    if (typeof req.body.ambulanceAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "ambulanceAvailable must be true or false.",
      });
    }

    hospital.ambulanceAvailable = req.body.ambulanceAvailable;

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Ambulance availability updated.",
      ambulanceAvailable: hospital.ambulanceAvailable,
    });
  } catch (error) {
    console.error("UPDATE AMBULANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ============================================================
// UPDATE HOSPITAL OPEN/CLOSED
// ============================================================

const updateHospitalStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await getOwnedHospital(req, id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found or unauthorized.",
      });
    }

    if (typeof req.body.isOpen !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isOpen must be true or false.",
      });
    }

    hospital.isOpen = req.body.isOpen;

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Hospital status updated.",
      isOpen: hospital.isOpen,
    });
  } catch (error) {
    console.error("UPDATE HOSPITAL STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ============================================================
// DELETE
// ============================================================

const deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hospital ID.",
      });
    }

    const hospital = await getOwnedHospital(req, id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found or unauthorized.",
      });
    }

    await hospital.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Hospital deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE HOSPITAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the hospital.",
    });
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  createHospital,
  getHospitals,
  getHospitalById,
  getMyHospital,
  updateHospital,
  updateBeds,
  updateBloodInventory,
  updateEmergencyStatus,
  updateAmbulanceStatus,
  updateHospitalStatus,
  deleteHospital,
};
