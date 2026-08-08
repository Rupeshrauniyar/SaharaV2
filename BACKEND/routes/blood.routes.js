const express = require("express");

const {
    createBloodRequest,
    getMyBloodRequests,
    getBloodRequestById,
    cancelBloodRequest
} = require("../controllers/blood.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


// Create blood request
router.post(
    "/",
    authMiddleware,
    createBloodRequest
);


// Get my blood requests
router.get(
    "/my",
    authMiddleware,
    getMyBloodRequests
);


// Get specific blood request
router.get(
    "/:id",
    authMiddleware,
    getBloodRequestById
);


// Cancel blood request
router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelBloodRequest
);


module.exports = router;