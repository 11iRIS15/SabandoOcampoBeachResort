const express = require("express");
const router = express.Router();

const {
  getAllContacts,
  updateContactStatus
} = require("../controllers/contactController");

const {
  verifyToken,
  adminOnly
} = require("../middleware/authMiddleware");

router.use(verifyToken, adminOnly);

router.get("/", getAllContacts);
router.patch("/:id/status", updateContactStatus);

module.exports = router;