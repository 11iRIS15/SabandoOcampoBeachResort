const express = require("express");
const router = express.Router();

const {
  getAccommodations,
  getAccommodationById
} = require("../controllers/accommodationController");

router.get("/", getAccommodations);
router.get("/:id", getAccommodationById);

module.exports = router;