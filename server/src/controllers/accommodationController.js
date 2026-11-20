const Accommodation = require("../models/Accommodation");

// Helper: find accommodation using MongoDB ID or accommodation code
const findAccommodation = async (identifier) => {
    const conditions = [
        { accommodation_code: identifier }
    ];

    // Only search by MongoDB ID if identifier is a valid ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
        conditions.push({ _id: identifier });
    }

    return Accommodation.findOne({ $or: conditions });
};

// Helper: convert MongoDB _id into id for frontend compatibility
const formatAccommodation = (accommodation) => {
    const item = accommodation.toObject();

    return {
        ...item,
        id: item._id.toString()
    };
};

// GET ALL ACTIVE ACCOMMODATIONS
const getAccommodations = async (req, res) => {
    try {
        const accommodations = await Accommodation.find({ is_active: true })
            .sort({ createdAt: -1 });

        const formattedAccommodations = accommodations.map(formatAccommodation);

        return res.status(200).json({
            success: true,
            count: formattedAccommodations.length,
            accommodations: formattedAccommodations
        });

    } catch (error) {
        console.error("Get accommodations error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve accommodations."
        });
    }
};

// GET SINGLE ACCOMMODATION
const getAccommodationById = async (req, res) => {
    try {
        const accommodation = await findAccommodation(req.params.id);

        if (!accommodation || !accommodation.is_active) {
            return res.status(404).json({
                success: false,
                message: "Accommodation not found."
            });
        }

        return res.status(200).json({
            success: true,
            accommodation: formatAccommodation(accommodation)
        });

    } catch (error) {
        console.error("Get accommodation error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve accommodation."
        });
    }
};

// ADMIN: GET ALL ACCOMMODATIONS INCLUDING INACTIVE
const adminGetAccommodations = async (req, res) => {
    try {
        const accommodations = await Accommodation.find()
            .sort({ createdAt: -1 });

        const formattedAccommodations = accommodations.map(formatAccommodation);

        return res.status(200).json({
            success: true,
            count: formattedAccommodations.length,
            accommodations: formattedAccommodations
        });

    } catch (error) {
        console.error("Admin accommodations error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve accommodations."
        });
    }
};

// ADMIN: ADD ACCOMMODATION
const createAccommodation = async (req, res) => {
    try {
        const {
            accommodation_code,
        code,
            name,
        category,
        description,
        price,
        capacity,
        quantity,
        image
        } = req.body;

        const accommodationCode = accommodation_code || code;

        if (
            !accommodationCode ||
            !name ||
            price === undefined ||
            capacity === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Code, name, price, and capacity are required."
            });
        }

        if (
            !Number.isFinite(Number(price)) ||
            Number(price) < 0 ||
            !Number.isInteger(Number(capacity)) ||
            Number(capacity) < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid price and capacity."
            });
        }

        const existing = await Accommodation.findOne({
            accommodation_code: accommodationCode
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Accommodation code already exists."
            });
        }

        const accommodation = await Accommodation.create({
            accommodation_code: accommodationCode,
            name,
            category: category || "Other",
            description: description || "",
            price: Number(price),
            capacity: Number(capacity),
            quantity: Math.max(1, Number(quantity) || 1),
            image: image || "",
            is_active: true
        });

        return res.status(201).json({
            success: true,
            message: "Accommodation added successfully!",
            id: accommodation._id.toString()
        });

    } catch (error) {
        console.error("Create accommodation error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to add accommodation."
        });
    }
};

// ADMIN: UPDATE ACCOMMODATION
const updateAccommodation = async (req, res) => {
    try {
        const identifier = req.params.id;

        const {
            name,
            category,
            description,
            price,
            capacity,
            quantity,
            image,
            is_active
        } = req.body;

        const existing = await findAccommodation(identifier);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Accommodation not found."
            });
        }

        if (
            price !== undefined &&
            (!Number.isFinite(Number(price)) || Number(price) < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid price."
            });
        }

        if (
            capacity !== undefined &&
            (!Number.isInteger(Number(capacity)) || Number(capacity) < 1)
        ) {
            return res.status(400).json({
                success: false,
                message: "Capacity must be at least 1."
            });
        }

        if (
            quantity !== undefined &&
            (!Number.isInteger(Number(quantity)) || Number(quantity) < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity cannot be negative."
            });
        }

        // Only update fields provided by the request
        if (name !== undefined) existing.name = name;
        if (category !== undefined) existing.category = category;
        if (description !== undefined) existing.description = description;
        if (price !== undefined) existing.price = Number(price);
        if (capacity !== undefined) existing.capacity = Number(capacity);
        if (quantity !== undefined) existing.quantity = Number(quantity);
        if (image !== undefined) existing.image = image;
        if (is_active !== undefined) existing.is_active = is_active;

        await existing.save();

        return res.status(200).json({
            success: true,
            message: "Accommodation updated successfully!"
        });

    } catch (error) {
        console.error("Update accommodation error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update accommodation."
        });
    }
};

// ADMIN: DELETE ACCOMMODATION (SOFT DELETE)
const deleteAccommodation = async (req, res) => {
    try {
        const accommodation = await findAccommodation(req.params.id);

        if (!accommodation) {
            return res.status(404).json({
                success: false,
                message: "Accommodation not found."
            });
        }

        accommodation.is_active = false;
        await accommodation.save();

        return res.status(200).json({
            success: true,
            message: "Accommodation removed successfully."
        });

    } catch (error) {
        console.error("Delete accommodation error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete accommodation."
        });
    }
};

module.exports = {
    getAccommodations,
    getAccommodationById,
    adminGetAccommodations,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation
};
