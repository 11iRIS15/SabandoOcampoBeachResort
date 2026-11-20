
const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema(
  {
    accommodation_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Room", "Cottage", "Villa", "Other"],
      default: "Room",
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Accommodation", accommodationSchema);
