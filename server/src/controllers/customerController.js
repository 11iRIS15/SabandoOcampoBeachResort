
const User = require("../models/User");
const Booking = require("../models/Booking");

// ==========================================
// GET ALL CUSTOMERS
// ==========================================

const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ created_at: -1 });

    const customersWithBookings = await Promise.all(
      customers.map(async (customer) => {
        const totalBookings = await Booking.countDocuments({
          user: customer._id,
        });

        return {
          id: customer._id,
          _id: customer._id,
          full_name: customer.full_name,
          email: customer.email,
          phone: customer.phone,
          created_at: customer.created_at,
          total_bookings: totalBookings,
        };
      })
    );

    return res.status(200).json({
      success: true,
      customers: customersWithBookings,
    });
  } catch (error) {
    console.error("Get all customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve customers.",
    });
  }
};

// ==========================================
// GET CUSTOMER BY ID
// ==========================================

const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    }).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      customer: {
        id: customer._id,
        _id: customer._id,
        full_name: customer.full_name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
        created_at: customer.created_at,
      },
    });
  } catch (error) {
    console.error("Get customer by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve customer.",
    });
  }
};

// ==========================================
// GET CUSTOMER BOOKINGS
// ==========================================

const getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await User.findOne({
      _id: customerId,
      role: "customer",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const bookings = await Booking.find({
      user: customer._id,
    })
      .populate("accommodation_id")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get customer bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve customer bookings.",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerBookings,
};
