const { pool } = require("../config/database");

// Get all registered customers
const getAllCustomers = async (req, res) => {
  try {
    const [customers] = await pool.query(
      `SELECT
         u.id,
         u.full_name,
         u.email,
         u.phone,
         u.created_at,
         COUNT(b.id) AS total_bookings
       FROM users u
       LEFT JOIN bookings b ON u.id = b.user_id
       WHERE u.role = 'customer'
       GROUP BY
         u.id,
         u.full_name,
         u.email,
         u.phone,
         u.created_at
       ORDER BY u.created_at DESC`
    );

    return res.json({
      success: true,
      count: customers.length,
      customers
    });

  } catch (error) {
    console.error("Get customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve customers."
    });
  }
};


// Get a specific customer's details
const getCustomerById = async (req, res) => {
  try {
    const [customers] = await pool.query(
      `SELECT
         id,
         full_name,
         email,
         phone,
         created_at
       FROM users
       WHERE id = ? AND role = 'customer'`,
      [req.params.id]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found."
      });
    }

    return res.json({
      success: true,
      customer: customers[0]
    });

  } catch (error) {
    console.error("Get customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve customer details."
    });
  }
};


// Get one customer's booking history
const getCustomerBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT
         b.*,
         a.name AS accommodation_name
       FROM bookings b
       JOIN accommodations a ON b.accommodation_id = a.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [req.params.id]
    );

    return res.json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error("Get customer bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve customer booking history."
    });
  }
};


module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerBookings
};