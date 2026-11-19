const { pool } = require("../config/database");

// Get reservation and payment reports
const getReports = async (req, res) => {
  try {
    // Reservation statistics
    const [bookingStats] = await pool.query(
      `SELECT
         COUNT(*) AS total_bookings,
         SUM(status = 'Pending') AS pending_bookings,
         SUM(status = 'Approved') AS approved_bookings,
         SUM(status = 'Rejected') AS rejected_bookings,
         SUM(status = 'Cancelled') AS cancelled_bookings,
         SUM(status = 'Completed') AS completed_bookings
       FROM bookings`
    );

    // Payment statistics
    const [paymentStats] = await pool.query(
      `SELECT
         COUNT(*) AS total_payments,
         COALESCE(SUM(CASE
           WHEN status = 'Paid' THEN amount
           ELSE 0
         END), 0) AS total_revenue,
         COALESCE(SUM(CASE
           WHEN status = 'Pending' THEN amount
           ELSE 0
         END), 0) AS pending_amount
       FROM payments`
    );

    // Monthly booking report (current year)
    const [monthlyBookings] = await pool.query(
      `SELECT
         MONTH(created_at) AS month_number,
         DATE_FORMAT(created_at, '%M') AS month_name,
         COUNT(*) AS total_bookings
       FROM bookings
       WHERE YEAR(created_at) = YEAR(CURDATE())
       GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%M')
       ORDER BY month_number ASC`
    );

    // Monthly verified payment report (current year)
    const [monthlyPayments] = await pool.query(
      `SELECT
         MONTH(created_at) AS month_number,
         DATE_FORMAT(created_at, '%M') AS month_name,
         COALESCE(SUM(amount), 0) AS total_revenue
       FROM payments
       WHERE status = 'Paid'
       AND YEAR(created_at) = YEAR(CURDATE())
       GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%M')
       ORDER BY month_number ASC`
    );

    // Most booked accommodations
    const [popularAccommodations] = await pool.query(
      `SELECT
         a.id,
         a.name,
         a.category,
         COUNT(b.id) AS total_bookings
       FROM accommodations a
       LEFT JOIN bookings b ON a.id = b.accommodation_id
       GROUP BY a.id, a.name, a.category
       ORDER BY total_bookings DESC
       LIMIT 5`
    );

    return res.json({
      success: true,
      reportYear: new Date().getFullYear(),

      bookingStatistics: bookingStats[0],
      paymentStatistics: paymentStats[0],

      monthlyBookings,
      monthlyPayments,
      popularAccommodations
    });

  } catch (error) {
    console.error("Reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate reports."
    });
  }
};

module.exports = { getReports };