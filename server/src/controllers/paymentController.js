const { pool } = require("../config/database");

// Customer submits a payment
const submitPayment = async (req, res) => {
  try {
    const {
      bookingId,
      booking_id,
      method,
      referenceNumber,
      reference_number,
      receiptImage,
      receipt_image
    } = req.body;

    const selectedBookingId = bookingId || booking_id;
    const selectedReference = referenceNumber || reference_number;
    const selectedReceipt = req.file
  ? `/uploads/receipts/${req.file.filename}`
  : receiptImage || receipt_image || null;
    if (!selectedBookingId || !method || !selectedReference) {
      return res.status(400).json({
        success: false,
        message: "Booking ID, payment method, and reference number are required."
      });
    }

    // Check that the booking belongs to the logged-in customer
    const [bookings] = await pool.query(
      `SELECT id, user_id, total_amount, status
       FROM bookings
       WHERE id = ? AND user_id = ?`,
      [selectedBookingId, req.user.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    const booking = bookings[0];

    if (["Cancelled", "Rejected"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Payment cannot be submitted for a cancelled or rejected booking."
      });
    }

    // Prevent another payment submission if the booking is already paid
    const [existingPayments] = await pool.query(
      `SELECT id, status
       FROM payments
       WHERE booking_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [booking.id]
    );

    if (
      existingPayments.length > 0 &&
      existingPayments[0].status === "Paid"
    ) {
      return res.status(409).json({
        success: false,
        message: "This booking has already been paid."
      });
    }

    if (
      existingPayments.length > 0 &&
      existingPayments[0].status === "Pending"
    ) {
      return res.status(409).json({
        success: false,
        message: "A payment for this booking is already awaiting verification."
      });
    }

    const [result] = await pool.query(
      `INSERT INTO payments
       (booking_id, amount, method, reference_number, receipt_image)
       VALUES (?, ?, ?, ?, ?)`,
      [
        booking.id,
        booking.total_amount,
        method,
        selectedReference,
        selectedReceipt
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Payment information submitted. Please wait for administrator verification.",
      payment: {
        id: result.insertId,
        booking_id: booking.id,
        amount: booking.total_amount,
        method,
        reference_number: selectedReference,
        receipt_image: selectedReceipt,
        status: "Pending"
      }
    });

  } catch (error) {
    console.error("Submit payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit payment information."
    });
  }
};


// Customer views their payments
const getMyPayments = async (req, res) => {
  try {
    const [payments] = await pool.query(
      `SELECT
         p.*,
         b.booking_reference,
         b.total_amount,
         b.status AS booking_status
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       WHERE b.user_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    return res.json({
      success: true,
      count: payments.length,
      payments
    });

  } catch (error) {
    console.error("Get my payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your payments."
    });
  }
};


// Administrator views all payments
const getAllPayments = async (req, res) => {
  try {
    const [payments] = await pool.query(
      `SELECT
         p.*,
         b.booking_reference,
         b.full_name,
         b.email,
         b.status AS booking_status
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       ORDER BY p.created_at DESC`
    );

    return res.json({
      success: true,
      count: payments.length,
      payments
    });

  } catch (error) {
    console.error("Get all payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve payment records."
    });
  }
};


// Administrator updates payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Paid", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status."
      });
    }

    const [result] = await pool.query(
      "UPDATE payments SET status = ? WHERE id = ?",
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found."
      });
    }

    return res.json({
      success: true,
      message: "Payment status updated successfully."
    });

  } catch (error) {
    console.error("Update payment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update payment status."
    });
  }
};


module.exports = {
  submitPayment,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus
};