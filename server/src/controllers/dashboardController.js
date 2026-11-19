const { pool } = require("../config/database");

// Get administrator dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Total customers
    const [customers] = await pool.query(
      `SELECT COUNT(*) AS total_customers
       FROM users
       WHERE role = 'customer'`
    );

    // Total bookings
    const [bookings] = await pool.query(
      `SELECT COUNT(*) AS total_bookings
       FROM bookings`
    );

    // Pending bookings
    const [pending] = await pool.query(
      `SELECT COUNT(*) AS pending_bookings
       FROM bookings
       WHERE status = 'Pending'`
    );

    // Approved bookings
    const [approved] = await pool.query(
      `SELECT COUNT(*) AS approved_bookings
       FROM bookings
       WHERE status = 'Approved'`
    );

    // Rejected bookings
    const [rejected] = await pool.query(
      `SELECT COUNT(*) AS rejected_bookings
       FROM bookings
       WHERE status = 'Rejected'`
    );

    // Cancelled bookings
    const [cancelled] = await pool.query(
      `SELECT COUNT(*) AS cancelled_bookings
       FROM bookings
       WHERE status = 'Cancelled'`
    );

    // Total verified payments
    const [payments] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_payments
       FROM payments
       WHERE status = 'Paid'`
    );

    // Pending payments
    const [pendingPayments] = await pool.query(
      `SELECT COUNT(*) AS pending_payments
       FROM payments
       WHERE status = 'Pending'`
    );

    // Recent bookings
    const [recentBookings] = await pool.query(
      `SELECT
         b.id,
         b.booking_reference,
         b.full_name,
         b.check_in,
         b.check_out,
         b.guests,
         b.total_amount,
         b.status,
         b.created_at,
         a.name AS accommodation_name
       FROM bookings b
       JOIN accommodations a ON b.accommodation_id = a.id
       ORDER BY b.created_at DESC
       LIMIT 5`
    );

    return res.json({
      success: true,
      statistics: {
        totalCustomers: customers[0].total_customers,
        totalBookings: bookings[0].total_bookings,
        pendingBookings: pending[0].pending_bookings,
        approvedBookings: approved[0].approved_bookings,
        rejectedBookings: rejected[0].rejected_bookings,
        cancelledBookings: cancelled[0].cancelled_bookings,
        totalPayments: payments[0].total_payments,
        pendingPayments: pendingPayments[0].pending_payments
      },
      recentBookings
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve dashboard statistics."
    });
  }
};

module.exports = { getDashboardStats };