const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      index: true,
    },

    unitsRequired: {
      type: Number,
      required: true,
      min: 1,
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
      index: true,
    },

    requiredBy: {
      type: Date,
      required: true,
    },

    contactName: {
      type: String,
      required: true,
      trim: true,
    },

    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },

    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: [
        "Open",
        "Matched",
        "Completed",
        "Cancelled",
        "Expired",
      ],
      default: "Open",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);