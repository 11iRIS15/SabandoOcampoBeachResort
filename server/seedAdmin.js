require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectMongoDB = require("./src/config/mongodb");
const User = require("./src/models/User");

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

    // Connect to MongoDB
    await connectMongoDB();

    const normalizedEmail = email.toLowerCase().trim();

    // Check if the account already exists in MongoDB
    const existingAdmin = await User.findOne({ email: normalizedEmail });

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(password, 12);

    if (existingAdmin) {
      // Update existing account to admin
      existingAdmin.full_name = name;
      existingAdmin.role = "admin";
      existingAdmin.password = hashedPassword;

      await existingAdmin.save();

      console.log("Existing account successfully updated to admin!");
      console.log("Admin email:", normalizedEmail);
    } else {
      // Create a new admin account
      await User.create({
        full_name: name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Administrator account created successfully!");
      console.log("Admin email:", normalizedEmail);
    }
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    // Close MongoDB connection
    const mongoose = require("mongoose");
    await mongoose.connection.close();
  }
};

createAdmin();