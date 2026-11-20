const User = require("../models/User");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Accommodation = require("../models/Accommodation");

// ADMIN DASHBOARD STATISTICS (MONGODB)
const getDashboardStats = async (req, res) =>  {
    try {
        // Total registered customers
        const totalCustomers = await User.countDocuments({
            role: "customer"
        });

        // Total bookings
        const totalBookings = await Booking.countDocuments();

        // Total accommodations
        const totalAccommodations = await Accommodation.countDocuments({
            is_active: true
        });

        // Total verified payments
        const totalPayments = await Payment.aggregate([
            {
                $match: {
                    payment_status: "verified"
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Recent bookings
        const recentBookings = await Booking.find()
            .populate("accommodation_id", "name")
            .sort({ createdAt: -1 })
            .limit(5);

        // Format recent bookings for the existing frontend
        const formattedBookings = recentBookings.map((booking) => ({
            _id: booking._id,
            fullName: booking.full_name,
            accommodationName: booking.accommodation_id?.name || "Unknown Accommodation",
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            guests: booking.guests,
            status: booking.status
        }));

        return res.json({
            success: true,
            stats: {
                reservations: totalBookings,
                customers: totalCustomers,
                accommodations: totalAccommodations,
                payments: totalPayments[0]?.total || 0
            },
            recentBookings: formattedBookings
        });

    } catch (error) {
        console.error("Dashboard MongoDB error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard information."
        });
    }
};

module.exports = { getDashboardStats };