const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings
} = require("../controllers/bookingController");

const { verifyToken } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);

module.exports = router;