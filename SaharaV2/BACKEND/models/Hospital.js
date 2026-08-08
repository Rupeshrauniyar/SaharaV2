const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: undefined,
      },
    },

    departments: [
      {
        type: String,
        trim: true,
      },
    ],

    beds: {
      total: {
        type: Number,
        default: 0,
      },
      available: {
        type: Number,
        default: 0,
      },
      icu: {
        type: Number,
        default: 0,
      },
      emergency: {
        type: Number,
        default: 0,
      },
    },

    bloodInventory: {
      "A+": { type: Number, default: 0 },
      "A-": { type: Number, default: 0 },
      "B+": { type: Number, default: 0 },
      "B-": { type: Number, default: 0 },
      "AB+": { type: Number, default: 0 },
      "AB-": { type: Number, default: 0 },
      "O+": { type: Number, default: 0 },
      "O-": { type: Number, default: 0 },
    },

    emergencyAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    ambulanceAvailable: {
      type: Boolean,
      default: false,
    },

    isOpen: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

hospitalSchema.index(
  { location: "2dsphere" },
  { sparse: true }
);

hospitalSchema.index({
  city: 1,
  emergencyAvailable: 1,
});

module.exports = mongoose.model("Hospital", hospitalSchema);