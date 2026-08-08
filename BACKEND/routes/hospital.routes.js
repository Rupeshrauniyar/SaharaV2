const express = require("express");

const {
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
    deleteHospital
} = require("../controllers/hospital.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const router = express.Router();


// ============================================================
// PUBLIC ROUTES
// ============================================================

// Get hospitals / search hospitals
router.get(
    "/",
    getHospitals
);


// Get single hospital
router.get(
    "/:id",
    getHospitalById
);


// ============================================================
// HOSPITAL ADMIN ROUTES
// ============================================================

// Create hospital
router.post(
    "/",
    authMiddleware,
    authorizeRoles("HospitalAdmin"),
    createHospital
);


// Get my hospital
router.get(
    "/admin/my",
    authMiddleware,
    authorizeRoles("HospitalAdmin"),
    getMyHospital
);


// Update hospital profile
router.patch(
    "/:id",
    authMiddleware,
    authorizeRoles("HospitalAdmin"),
    updateHospital
);


// Update beds
router.patch(
    "/:id/beds",
    authMiddleware,
    authorizeRoles("HospitalAdmin"),
    updateBeds
);


// Update blood inventory
router.patch(
    "/:id/blood-inventory",
    authMiddleware,
    authorizeRoles("HospitalAdmin"),
    updateBloodInventory
);


// Emergency availability
router.patch(
    "/:id/emergency",
    authMiddleware,
    authorizeRoles("HospitalAdmin"),
    updateEmergencyStatus
);


// Ambulance availability
router.patch(
    "/:id/ambulance",
    authMiddleware,
    authorizeRoles("HospitalAdmin"),
    updateAmbulanceStatus
);


// Open / closed
router.patch(
    "/:id/status",
    authMiddleware,
    authorizeRoles("HospitalAdmin"),
    updateHospitalStatus
);


// Delete hospital
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("HospitalAdmin"),
    deleteHospital
);


module.exports = router;