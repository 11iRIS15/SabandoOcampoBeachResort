const express = require("express");
const router = express.Router();

const {
  getAllCustomers,
} = require("../controllers/customerController");

const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

router.use(verifyToken, verifyAdmin);

router.get("/", getAllCustomers);

module.exports = router;