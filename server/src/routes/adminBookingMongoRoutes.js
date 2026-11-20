const express = require("express");
const router = express.Router();

const {
    getAllBookings,
    updateBookingStatus,
} = require("../controllers/bookingMongoController");

const {
    verifyToken,
    adminOnly,
} = require("../middleware/authMiddleware");

// GET ALL BOOKINGS (ADMIN)
router.get("/", verifyToken, adminOnly, getAllBookings);

// UPDATE BOOKING STATUS (ADMIN)
router.put("/:id/status", verifyToken, adminOnly, updateBookingStatus);

module.exports = router;