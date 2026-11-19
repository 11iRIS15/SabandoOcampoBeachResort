const crypto = require("crypto");
const { pool } = require("../config/database");

// Create a new booking
const createBooking = async (req, res) => {
  let connection;

  try {
    const {
      accommodationId,
      accommodation_id,
      accommodationCode,
      accommodation_code,
      checkIn,
      check_in,
      checkOut,
      check_out,
      guests,
      phone,
      requests
    } = req.body;

    const accommodationIdentifier =
      accommodationId ||
      accommodation_id ||
      accommodationCode ||
      accommodation_code;

    const arrival = checkIn || check_in;
    const departure = checkOut || check_out;
    const guestCount = Number(guests);

    if (!accommodationIdentifier || !arrival || !departure || !guests) {
      return res.status(400).json({
        success: false,
        message: "Please provide the accommodation, dates, and number of guests."
      });
    }

    const validDate = (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

      const date = new Date(`${value}T00:00:00`);
      return !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value;
    };

    if (!validDate(arrival) || !validDate(departure) || departure <= arrival) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid check-in and check-out dates."
      });
    }

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        success: false,
        message: "The number of guests must be at least 1."
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Get and lock the selected accommodation
    const [accommodations] = await connection.query(
      `SELECT * FROM accommodations
       WHERE (id = ? OR accommodation_code = ?)
       AND is_active = TRUE
       LIMIT 1
       FOR UPDATE`,
      [accommodationIdentifier, accommodationIdentifier]
    );

    if (accommodations.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "The selected accommodation was not found."
      });
    }

    const accommodation = accommodations[0];

    if (guestCount > accommodation.capacity) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: `This accommodation can only accommodate ${accommodation.capacity} guests.`
      });
    }

    if (Number(accommodation.price) <= 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "The accommodation price has not been configured yet. Please contact the administrator."
      });
    }

    // Check overlapping reservations
    const [existingBookings] = await connection.query(
      `SELECT COUNT(*) AS booked
       FROM bookings
       WHERE accommodation_id = ?
       AND check_in < ?
       AND check_out > ?
       AND status IN ('Pending', 'Approved')`,
      [accommodation.id, departure, arrival]
    );

    if (Number(existingBookings[0].booked) >= Number(accommodation.quantity)) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Sorry, this accommodation is not available for your selected dates."
      });
    }

    // Get customer details from the logged-in account
    const [users] = await connection.query(
      "SELECT id, full_name, email, phone FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Customer account not found."
      });
    }

    const customer = users[0];
    const customerPhone = phone || customer.phone;

    if (!customerPhone) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Please provide your contact number."
      });
    }

    // Calculate the number of nights
    const checkInDate = new Date(`${arrival}T00:00:00`);
    const checkOutDate = new Date(`${departure}T00:00:00`);
    const nights = Math.round(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    const totalAmount = Number(accommodation.price) * nights;
    const bookingReference =
      "SOR-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const [result] = await connection.query(
      `INSERT INTO bookings
       (
         booking_reference,
         user_id,
         accommodation_id,
         full_name,
         email,
         phone,
         check_in,
         check_out,
         guests,
         requests,
         total_amount
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingReference,
        customer.id,
        accommodation.id,
        customer.full_name,
        customer.email,
        customerPhone,
        arrival,
        departure,
        guestCount,
        requests || null,
        totalAmount
      ]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Your reservation has been submitted successfully.",
      booking: {
        id: result.insertId,
        booking_reference: bookingReference,
        accommodation: accommodation.name,
        check_in: arrival,
        check_out: departure,
        nights,
        guests: guestCount,
        total_amount: totalAmount,
        status: "Pending"
      }
    });

  } catch (error) {
    if (connection) await connection.rollback();

    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create your reservation."
    });

  } finally {
    if (connection) connection.release();
  }
};


// Get bookings of the logged-in customer
const getMyBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT
         b.*,
         a.name AS accommodation_name,
         a.category AS accommodation_category,
         a.image AS accommodation_image
       FROM bookings b
       JOIN accommodations a ON b.accommodation_id = a.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    return res.json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error("Get my bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your bookings."
    });
  }
};


// Get all bookings for the administrator
const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT
         b.*,
         a.name AS accommodation_name,
         a.category AS accommodation_category,
         u.email AS customer_email
       FROM bookings b
       JOIN accommodations a ON b.accommodation_id = a.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC`
    );

    return res.json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error("Get all bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve reservations."
    });
  }
};


// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Cancelled",
      "Completed"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status."
      });
    }

    const [result] = await pool.query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    return res.json({
      success: true,
      message: "Booking status updated successfully."
    });

  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update booking status."
    });
  }
};


module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus
};