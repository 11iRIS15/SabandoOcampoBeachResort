
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    payment_code: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    payment_method: {
      type: String,
      enum: ["cash", "gcash", "bank_transfer", "other"],
      default: "cash",
    },

    payment_status: {
      type: String,
      enum: ["pending", "verified", "rejected", "refunded"],
      default: "pending",
    },

    reference_number: {
      type: String,
      default: "",
    },

    payment_date: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
