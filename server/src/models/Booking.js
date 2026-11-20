
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    accommodation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },

    check_in: {
      type: Date,
      required: true,
    },

    check_out: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    total_price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Cancelled",
        "Completed",
      ],
      default: "Pending",
    },

    special_requests: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ accommodation_id: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ check_in: 1, check_out: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
