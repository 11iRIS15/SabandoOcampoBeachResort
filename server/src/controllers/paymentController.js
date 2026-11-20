
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/User");

// ==========================================
// GENERATE UNIQUE PAYMENT CODE
// ==========================================

const generatePaymentCode = () => {
  return `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// ==========================================
// CUSTOMER SUBMITS PAYMENT
// ==========================================

const submitPayment = async (req, res) => {
  try {
    const {
      bookingId,
      booking_id,
      method,
      payment_method,
      referenceNumber,
      reference_number,
      receiptImage,
      receipt_image,
    } = req.body;

    const selectedBookingId = bookingId || booking_id;
    const selectedMethod = method || payment_method;
    const selectedReference = referenceNumber || reference_number;

    const selectedReceipt = req.file
      ? `/uploads/receipts/${req.file.filename}`
      : receiptImage || receipt_image || null;

    if (!selectedBookingId || !selectedMethod || !selectedReference) {
      return res.status(400).json({
        success: false,
        message: "Booking ID, payment method, and reference number are required.",
      });
    }

    // Find booking belonging to the logged-in customer
    const booking = await Booking.findOne({
      _id: selectedBookingId,
      user: req.user.id,
    }).populate("accommodation_id");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (["Cancelled", "Rejected"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Payment cannot be submitted for a cancelled or rejected booking.",
      });
    }

    // Find MongoDB user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    // Check for existing payment
    const existingPayment = await Payment.findOne({
      booking: booking._id,
    }).sort({ createdAt: -1 });

    if (existingPayment) {
      if (existingPayment.payment_status === "verified") {
        return res.status(409).json({
          success: false,
          message: "This booking has already been paid.",
        });
      }

      if (existingPayment.payment_status === "pending") {
        return res.status(409).json({
          success: false,
          message: "A payment for this booking is already awaiting verification.",
        });
      }
    }

    // Create MongoDB payment record
    const payment = await Payment.create({
      payment_code: generatePaymentCode(),
      booking: booking._id,
      user: user._id,
      amount: booking.total_price,
      payment_method: selectedMethod.toLowerCase(),
      payment_status: "pending",
      reference_number: selectedReference,
      notes: selectedReceipt || "",
    });

    return res.status(201).json({
      success: true,
      message: "Payment information submitted. Please wait for administrator verification.",
      payment: {
        id: payment._id,
        payment_code: payment.payment_code,
        booking_id: booking._id,
        amount: payment.amount,
        method: payment.payment_method,
        reference_number: payment.reference_number,
        receipt_image: selectedReceipt,
        status: payment.payment_status,
      },
    });
  } catch (error) {
    console.error("Submit payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit payment information.",
    });
  }
};

// ==========================================
// CUSTOMER VIEWS THEIR PAYMENTS
// ==========================================

const getMyPayments = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const payments = await Payment.find({
      user: user._id,
    })
      .populate({
        path: "booking",
        select: "booking_reference total_price status check_in check_out accommodation_id",
      })
      .populate("user", "full_name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get my payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your payments.",
    });
  }
};

// ==========================================
// ADMIN VIEWS ALL PAYMENTS
// ==========================================

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "booking",
        select: "booking_reference full_name email total_price status check_in check_out accommodation_id",
      })
      .populate("user", "full_name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get all payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve payment records.",
    });
  }
};

// ==========================================
// ADMIN UPDATES PAYMENT STATUS
// ==========================================

const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "verified", "rejected", "refunded"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status.",
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { payment_status: status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found.",
      });
    }

    return res.json({
      success: true,
      message: "Payment status updated successfully.",
      payment,
    });
  } catch (error) {
    console.error("Update payment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update payment status.",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  submitPayment,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus,
};
