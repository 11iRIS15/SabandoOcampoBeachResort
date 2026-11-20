const express = require("express");
const router = express.Router();

const {
    createBooking,
    getMyBookings,
} = require("../controllers/bookingMongoController");

const { verifyToken } = require("../middleware/authMiddleware");

// CREATE BOOKING
router.post("/", verifyToken, createBooking);

// GET MY BOOKINGS
router.get("/my", verifyToken, getMyBookings);

module.exports = router;