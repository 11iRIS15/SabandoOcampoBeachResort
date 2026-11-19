const express = require("express");
const router = express.Router();

const {
  getAllCustomers,
  getCustomerById,
  getCustomerBookings
} = require("../controllers/customerController");

const {
  verifyToken,
  adminOnly
} = require("../middleware/authMiddleware");

router.use(verifyToken, adminOnly);

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.get("/:id/bookings", getCustomerBookings);

module.exports = router;