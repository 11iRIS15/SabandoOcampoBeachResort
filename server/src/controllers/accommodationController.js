
const { pool } = require("../config/database");

// GET ALL ACCOMMODATIONS
const getAccommodations = async (req, res) => {
    try {
        const [accommodations] = await pool.query(
            `SELECT
                id,
                accommodation_code,
                name,
                category,
                description,
                price,
                capacity,
                quantity,
                image,
                is_active
             FROM accommodations
             WHERE is_active = TRUE
             ORDER BY id DESC`
        );

        return res.status(200).json({
            success: true,
            count: accommodations.length,
            accommodations
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
        const identifier = req.params.id;

        const [rows] = await pool.query(
            `SELECT * FROM accommodations
             WHERE accommodation_code = ? OR id = ?
             LIMIT 1`,
            [identifier, identifier]
        );

        if (rows.length === 0 || !rows[0].is_active) {
            return res.status(404).json({
                success: false,
                message: "Accommodation not found."
            });
        }

        return res.status(200).json({
            success: true,
            accommodation: rows[0]
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
        const [accommodations] = await pool.query(
            `SELECT * FROM accommodations ORDER BY id DESC`
        );

        return res.status(200).json({
            success: true,
            count: accommodations.length,
            accommodations
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

        const [existing] = await pool.query(
            `SELECT id FROM accommodations
             WHERE accommodation_code = ?`,
            [accommodationCode]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Accommodation code already exists."
            });
        }

        const [result] = await pool.query(
            `INSERT INTO accommodations
            (
                accommodation_code,
                name,
                category,
                description,
                price,
                capacity,
                quantity,
                image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                accommodationCode,
                name,
                category || null,
                description || null,
                Number(price),
                Number(capacity),
                Math.max(1, Number(quantity) || 1),
                image || null
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Accommodation added successfully!",
            id: result.insertId
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

        const [existing] = await pool.query(
            `SELECT id FROM accommodations
             WHERE accommodation_code = ? OR id = ?
             LIMIT 1`,
            [identifier, identifier]
        );

        if (existing.length === 0) {
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

        await pool.query(
            `UPDATE accommodations SET
                name = COALESCE(?, name),
                category = COALESCE(?, category),
                description = COALESCE(?, description),
                price = COALESCE(?, price),
                capacity = COALESCE(?, capacity),
                quantity = COALESCE(?, quantity),
                image = COALESCE(?, image),
                is_active = COALESCE(?, is_active)
             WHERE id = ?`,
            [
                name ?? null,
                category ?? null,
                description ?? null,
                price === undefined ? null : Number(price),
                capacity === undefined ? null : Number(capacity),
                quantity === undefined ? null : Number(quantity),
                image ?? null,
                is_active === undefined ? null : Boolean(is_active),
                existing[0].id
            ]
        );

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
        const identifier = req.params.id;

        const [result] = await pool.query(
            `UPDATE accommodations
             SET is_active = FALSE
             WHERE accommodation_code = ? OR id = ?`,
            [identifier, identifier]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Accommodation not found."
            });
        }

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
