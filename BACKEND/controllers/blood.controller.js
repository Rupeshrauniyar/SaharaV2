const BloodRequestModel = require("../models/BloodRequest");
const HospitalModel = require("../models/Hospital");

// =====================================================
// CREATE BLOOD REQUEST
// =====================================================

const createBloodRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      hospital,
      hospitalName,
      city,
      address,
      urgency,
      requiredBy,
      contactName,
      contactPhone,
      additionalNotes,
    } = req.body;

    const trimmedHospitalName = hospitalName?.trim();

    // =================================================
    // AUTHENTICATED USER
    // =================================================

    const requestedBy = req.user.id;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (
      !patientName ||
      !bloodGroup ||
      !unitsRequired ||
      (!hospital && !trimmedHospitalName) ||
      !city ||
      !address ||
      !requiredBy ||
      !contactName ||
      !contactPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // =================================================
    // VALIDATE BLOOD GROUP
    // =================================================

    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood group.",
      });
    }

    // =================================================
    // VALIDATE UNITS
    // =================================================

    if (!Number.isInteger(Number(unitsRequired)) || Number(unitsRequired) < 1) {
      return res.status(400).json({
        success: false,
        message: "Units required must be at least 1.",
      });
    }

    // =================================================
    // VALIDATE URGENCY
    // =================================================

    const validUrgencies = ["Low", "Medium", "High", "Critical"];

    const requestUrgency = urgency || "Medium";

    if (!validUrgencies.includes(requestUrgency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid urgency level.",
      });
    }

    // =================================================
    // VALIDATE DATE
    // =================================================

    const requiredDate = new Date(requiredBy);

    if (isNaN(requiredDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid required-by date.",
      });
    }

    // =================================================
    // CHECK HOSPITAL (when selected from list)
    // =================================================

    if (hospital) {
      const hospitalExists = await HospitalModel.findById(hospital);

      if (!hospitalExists) {
        return res.status(404).json({
          success: false,
          message: "Hospital not found.",
        });
      }
    }

    // =================================================
    // CREATE BLOOD REQUEST
    // =================================================

    const bloodRequest = await BloodRequestModel.create({
      requestedBy,

      patientName: patientName.trim(),

      bloodGroup,

      unitsRequired: Number(unitsRequired),

      hospital: hospital || undefined,

      hospitalName: trimmedHospitalName || undefined,

      city: city.trim(),

      address: address.trim(),

      urgency: requestUrgency,

      requiredBy: requiredDate,

      contactName: contactName.trim(),

      contactPhone: contactPhone.trim(),

      additionalNotes: additionalNotes?.trim() || undefined,

      status: "Open",
    });

    // =================================================
    // RETURN CREATED REQUEST
    // =================================================

    const populatedRequest = await BloodRequestModel.findById(bloodRequest._id)
      .populate("requestedBy", "fullName email phone")
      .populate("hospital", "hospitalName address city");

    return res.status(201).json({
      success: true,

      message: "Blood request created successfully.",

      request: populatedRequest,
    });
  } catch (error) {
    console.error("Create Blood Request Error:", error);

    return res.status(500).json({
      success: false,

      message: "Something went wrong while creating the blood request.",
    });
  }
};

// =====================================================
// GET MY BLOOD REQUESTS
// =====================================================

const getMyBloodRequests = async (req, res) => {
  try {
    const requestedBy = req.user.id;
    console.log(requestedBy);

    const requests = await BloodRequestModel.find({ requestedBy })
      .populate("hospital", "hospitalName address city")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      count: requests.length,

      requests,
    });
  } catch (error) {
    console.error("Get My Blood Requests Error:", error);

    return res.status(500).json({
      success: false,

      message: "Something went wrong while fetching blood requests.",
    });
  }
};

// =====================================================
// GET SINGLE BLOOD REQUEST
// =====================================================

const getBloodRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BloodRequestModel.findById(id)
      .populate("requestedBy", "fullName email phone")
      .populate("hospital", "hospitalName address city");

    if (!request) {
      return res.status(404).json({
        success: false,

        message: "Blood request not found.",
      });
    }

    return res.status(200).json({
      success: true,

      request,
    });
  } catch (error) {
    console.error("Get Blood Request Error:", error);

    return res.status(500).json({
      success: false,

      message: "Something went wrong while fetching the blood request.",
    });
  }
};

// =====================================================
// CANCEL BLOOD REQUEST
// =====================================================

const cancelBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const requestedBy = req.user.id;

    const request = await BloodRequestModel.findOne({
      _id: id,
      requestedBy,
    });

    if (!request) {
      return res.status(404).json({
        success: false,

        message: "Blood request not found or you are not authorized.",
      });
    }

    if (request.status === "Completed") {
      return res.status(400).json({
        success: false,

        message: "Completed blood requests cannot be cancelled.",
      });
    }

    if (request.status === "Cancelled") {
      return res.status(400).json({
        success: false,

        message: "Blood request is already cancelled.",
      });
    }

    request.status = "Cancelled";

    await request.save();

    return res.status(200).json({
      success: true,

      message: "Blood request cancelled successfully.",

      request,
    });
  } catch (error) {
    console.error("Cancel Blood Request Error:", error);

    return res.status(500).json({
      success: false,

      message: "Something went wrong while cancelling the request.",
    });
  }
};
// =====================================================
// GET ACTIVE BLOOD REQUESTS
// =====================================================

const getActiveBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequestModel.find({
      status: "Open",
      requiredBy: {
        $gt: new Date(),
      },
    })
      .populate(
        "requestedBy",
        "fullName email phone"
      )
      .populate(
        "hospital",
        "hospitalName name address city phone"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get Active Blood Requests Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching active blood requests.",
    });
  }
};
// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createBloodRequest,
  getMyBloodRequests,
  getBloodRequestById,
  cancelBloodRequest,
  getActiveBloodRequests
};
