
require("dotenv").config();

const bcrypt = require("bcryptjs");
const { pool } = require("./src/config/database");

const createAdmin = async () => {
    try {
        const name = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!name || !email || !password) {
            throw new Error("Admin environment variables are missing.");
        }

        if (password.length < 12) {
            throw new Error("Admin password must be at least 12 characters.");
        }

        const [existing] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            console.log("Admin account already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await pool.query(
            `INSERT INTO users
            (full_name, email, password, role)
            VALUES (?, ?, ?, 'admin')`,
            [name, email, hashedPassword]
        );

        console.log("Administrator account created successfully!");
        console.log("Admin email:", email);

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

createAdmin();
