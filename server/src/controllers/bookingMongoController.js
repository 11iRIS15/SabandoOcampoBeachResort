
const Booking = require("../models/Booking");
const Accommodation = require("../models/Accommodation");
const User = require("../models/User");

// ==========================================
// CREATE BOOKING
// ==========================================

const createBooking = async (req, res) => {
  try {
    const {
      accommodation_id,
      check_in,
      check_out,
      guests,
      special_requests,
    } = req.body;

    if (
      !accommodation_id ||
      !check_in ||
      !check_out ||
      !guests
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required booking fields.",
      });
    }

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (
      isNaN(checkInDate.getTime()) ||
      isNaN(checkOutDate.getTime()) ||
      checkOutDate <= checkInDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date.",
      });
    }

    const accommodation = await Accommodation.findById(
      accommodation_id
    );

    if (!accommodation || !accommodation.is_active) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found or unavailable.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const overlappingBooking = await Booking.findOne({
      accommodation_id,
      status: { $in: ["Pending", "Approved"] },
      check_in: { $lt: checkOutDate },
      check_out: { $gt: checkInDate },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: "Accommodation is already booked for those dates.",
      });
    }

    const numberOfNights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = accommodation.price * numberOfNights;

    const booking = await Booking.create({
      user: user._id,
      accommodation_id: accommodation._id,
      check_in: checkInDate,
      check_out: checkOutDate,
      guests: Number(guests),
      total_price: totalPrice,
      special_requests: special_requests || "",
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking.",
    });
  }
};

// ==========================================
// GET MY BOOKINGS
// ==========================================

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("accommodation_id")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings.",
    });
  }
};

// ==========================================
// GET ALL BOOKINGS (ADMIN)
// ==========================================

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "full_name email phone")
      .populate("accommodation_id")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings.",
    });
  }
};

// ==========================================
// GET BOOKING BY ID (ADMIN)
// ==========================================

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "full_name email phone")
      .populate("accommodation_id");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve booking.",
    });
  }
};

// ==========================================
// UPDATE BOOKING STATUS (ADMIN)
// ==========================================

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Cancelled",
      "Completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status.",
    });
  }
};

// ==========================================
// DELETE BOOKING (ADMIN)
// ==========================================

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete booking.",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};
