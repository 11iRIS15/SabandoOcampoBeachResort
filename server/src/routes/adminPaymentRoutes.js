const express = require("express");
const router = express.Router();

const {
  getAllPayments,
  updatePaymentStatus,
} = require("../controllers/paymentController");

const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

router.use(verifyToken, verifyAdmin);

router.get("/", getAllPayments);
router.patch("/:id/status", updatePaymentStatus);

module.exports = router;