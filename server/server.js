
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

// Database connections
const connectMongoDB = require("./src/config/mongodb");

// Route imports
const authRoutes = require("./src/routes/authRoutes");

const accommodationRoutes = require("./src/routes/accommodationRoutes");
const adminAccommodationRoutes = require("./src/routes/adminAccommodationRoutes");

// MongoDB Booking Routes
const bookingMongoRoutes = require("./src/routes/bookingMongoRoutes");
const adminBookingMongoRoutes = require("./src/routes/adminBookingMongoRoutes");

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

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
  // Netlify production frontend
  "https://sabandoocampobeachresort.netlify.app",

  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5180",

  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
  "http://127.0.0.1:5177",
  "http://127.0.0.1:5178",
  "http://127.0.0.1:5179",
  "http://127.0.0.1:5180",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin (Postman, PowerShell, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Allow approved frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(null, false);
    },
    credentials: true,
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

// ==========================================
// MAIN API ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sabando Ocampo Beach Resort API is running!",
  });
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
  });
});

// ==========================================
// AUTHENTICATION
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// ACCOMMODATIONS
// ==========================================

app.use("/api/accommodations", accommodationRoutes);
app.use("/api/admin/accommodations", adminAccommodationRoutes);

// ==========================================
// MONGODB BOOKING ROUTES
// ==========================================

app.use("/api/mongodb/bookings", bookingMongoRoutes);
app.use("/api/mongodb/admin/bookings", adminBookingMongoRoutes);

// ==========================================
// PAYMENTS
// ==========================================

app.use("/api/payments", paymentRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);

// ==========================================
// CONTACT AND INQUIRIES
// ==========================================

app.use("/api/contact", contactRoutes);
app.use("/api/admin/contacts", adminContactRoutes);

// ==========================================
// ADMIN DASHBOARD
// ==========================================

app.use("/api/admin/dashboard", dashboardRoutes);

// ==========================================
// CUSTOMER MANAGEMENT
// ==========================================

app.use("/api/admin/customers", customerRoutes);

// ==========================================
// REPORTS
// ==========================================

app.use("/api/admin/reports", reportRoutes);

// ==========================================
// HANDLE UNKNOWN ROUTES
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(400).json({
    success: false,
    message: err.message || "An unexpected error occurred.",
  });
});

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectMongoDB();

    // Start Express
    app.listen(PORT, () => {
      console.log("----------------------------------------");
      console.log("SABANDO OCAMPO BEACH RESORT API");
      console.log("----------------------------------------");
      console.log(`Server running: http://localhost:${PORT}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
      console.log("----------------------------------------");
      console.log("MongoDB Atlas connection successful!");
      console.log("----------------------------------------");
      console.log("MongoDB Booking API:");
      console.log(`Customer: http://localhost:${PORT}/api/mongodb/bookings`);
      console.log(`Admin: http://localhost:${PORT}/api/mongodb/admin/bookings`);
      console.log("----------------------------------------");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
