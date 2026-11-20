const express = require("express");
const router = express.Router();

const {
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/bookingMongoController");

const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

// GET ALL BOOKINGS (ADMIN)
router.get("/", verifyToken, verifyAdmin, getAllBookings);

// UPDATE BOOKING STATUS (ADMIN)
router.put("/:id/status", verifyToken, verifyAdmin, updateBookingStatus);

module.exports = router;