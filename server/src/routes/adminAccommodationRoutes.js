const express = require("express");
const router = express.Router();

const {
  adminGetAccommodations,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation
} = require("../controllers/accommodationController");

const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

router.use(verifyToken, adminOnly);

router.get("/", adminGetAccommodations);
router.post("/", createAccommodation);
router.put("/:id", updateAccommodation);
router.delete("/:id", deleteAccommodation);

module.exports = router;