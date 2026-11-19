const express = require("express");
const router = express.Router();

const {
  getAllPayments,
  updatePaymentStatus
} = require("../controllers/paymentController");

const {
  verifyToken,
  adminOnly
} = require("../middleware/authMiddleware");

router.use(verifyToken, adminOnly);

router.get("/", getAllPayments);
router.patch("/:id/status", updatePaymentStatus);

module.exports = router;
