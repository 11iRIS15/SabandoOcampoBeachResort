const express = require("express");
const router = express.Router();

const {
  getReports
} = require("../controllers/reportController");

const {
  verifyToken,
  adminOnly
} = require("../middleware/authMiddleware");

router.use(verifyToken, adminOnly);

router.get("/", getReports);

module.exports = router;