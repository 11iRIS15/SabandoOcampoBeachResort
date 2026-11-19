const express = require("express");
const router = express.Router();

const {
  getAllBookings,
  updateBookingStatus
} = require("../controllers/bookingController");

const {
  verifyToken,
  adminOnly
} = require("../middleware/authMiddleware");

router.use(verifyToken, adminOnly);

router.get("/", getAllBookings);
router.patch("/:id/status", updateBookingStatus);

module.exports = router;