const express = require("express");
const router = express.Router();

const { getReports } = require("../controllers/reportController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.use(verifyToken, verifyAdmin);

router.get("/", getReports);

module.exports = router;