const express = require("express");
const router = express.Router();

const {
  submitPayment,
  getMyPayments
} = require("../controllers/paymentController");

const { verifyToken } = require("../middleware/authMiddleware");
const uploadReceipt = require("../middleware/uploadMiddleware");

router.use(verifyToken);

// Upload receipt using the field name "receipt"
router.post(
  "/",
  uploadReceipt.single("receipt"),
  submitPayment
);

router.get("/my-payments", getMyPayments);

module.exports = router;