const express = require("express");
const router = express.Router();

const {
  getDashboardStats
} = require("../controllers/dashboardController");

const {
  verifyToken,
  adminOnly
} = require("../middleware/authMiddleware");

router.use(verifyToken, adminOnly);

router.get("/", getDashboardStats);

module.exports = router;