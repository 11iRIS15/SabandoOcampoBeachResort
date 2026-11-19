
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

// Database connection
const { testConnection } = require("./src/config/database");

// Route imports
const authRoutes = require("./src/routes/authRoutes");

const accommodationRoutes = require("./src/routes/accommodationRoutes");
const adminAccommodationRoutes = require("./src/routes/adminAccommodationRoutes");

const bookingRoutes = require("./src/routes/bookingRoutes");
const adminBookingRoutes = require("./src/routes/adminBookingRoutes");

const paymentRoutes = require("./src/routes/paymentRoutes");
const adminPaymentRoutes = require("./src/routes/adminPaymentRoutes");

const contactRoutes = require("./src/routes/contactRoutes");
const adminContactRoutes = require("./src/routes/adminContactRoutes");

const dashboardRoutes = require("./src/routes/dashboardRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded receipt images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Main API routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sabando Ocampo Beach Resort API is running!"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy"
  });
});

// Authentication
app.use("/api/auth", authRoutes);

// Accommodations
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/admin/accommodations", adminAccommodationRoutes);

// Bookings
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);

// Payments
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);

// Contact and inquiries
app.use("/api/contact", contactRoutes);
app.use("/api/admin/contacts", adminContactRoutes);

// Admin dashboard
app.use("/api/admin/dashboard", dashboardRoutes);

// Customer management
app.use("/api/admin/customers", customerRoutes);

// Reports
app.use("/api/admin/reports", reportRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  return res.status(400).json({
    success: false,
    message: err.message || "An unexpected error occurred."
  });
});

// Start server after testing database connection
const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log("----------------------------------------");
      console.log("SABANDO OCAMPO BEACH RESORT API");
      console.log("----------------------------------------");
      console.log(`Server running: http://localhost:${PORT}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
      console.log("----------------------------------------");
      console.log("Database connection successful!");
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
