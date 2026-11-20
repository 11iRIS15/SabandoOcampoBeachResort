
const express = require("express");
const router = express.Router();

const {
    getAccommodations,
    getAccommodationById
} = require("../controllers/accommodationController");

// GET all active accommodations
router.get("/", getAccommodations);

// GET one accommodation by ID or code
router.get("/:id", getAccommodationById);

module.exports = router;
