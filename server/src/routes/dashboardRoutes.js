const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

router.use(verifyToken, verifyAdmin);

router.get("/", getDashboardStats);

module.exports = router;