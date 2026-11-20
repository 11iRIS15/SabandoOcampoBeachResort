const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Accommodation = require("../models/Accommodation");

// Get reservation and payment reports
const getReports = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Reservation statistics
    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      status: "Pending"
    });

    const approvedBookings = await Booking.countDocuments({
      status: "Approved"
    });

    const rejectedBookings = await Booking.countDocuments({
      status: "Rejected"
    });

    const cancelledBookings = await Booking.countDocuments({
      status: "Cancelled"
    });

    const completedBookings = await Booking.countDocuments({
      status: "Completed"
    });

    const bookingStatistics = {
      total_bookings: totalBookings,
      pending_bookings: pendingBookings,
      approved_bookings: approvedBookings,
      rejected_bookings: rejectedBookings,
      cancelled_bookings: cancelledBookings,
      completed_bookings: completedBookings
    };

    // Payment statistics
    const totalPayments = await Payment.countDocuments();

    const paymentTotals = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total_revenue: {
            $sum: {
              $cond: [
                { $eq: ["$payment_status", "verified"] },
                "$amount",
                0
              ]
            }
          },
          pending_amount: {
            $sum: {
              $cond: [
                { $eq: ["$payment_status", "pending"] },
                "$amount",
                0
              ]
            }
          }
        }
      }
    ]);

    const paymentStatistics = {
      total_payments: totalPayments,
      total_revenue: paymentTotals[0]?.total_revenue || 0,
      pending_amount: paymentTotals[0]?.pending_amount || 0
    };

    // Monthly booking report (current year)
    const monthlyBookingData = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total_bookings: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const monthlyBookings = monthlyBookingData.map((item) => ({
      month_number: item._id,
      month_name: monthNames[item._id - 1],
      total_bookings: item.total_bookings
    }));

    // Monthly verified payment report (current year)
    const monthlyPaymentData = await Payment.aggregate([
      {
        $match: {
          payment_status: "verified",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total_revenue: { $sum: "$amount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const monthlyPayments = monthlyPaymentData.map((item) => ({
      month_number: item._id,
      month_name: monthNames[item._id - 1],
      total_revenue: item.total_revenue
    }));

    // Most booked accommodations
    const accommodationBookings = await Booking.aggregate([
      {
        $group: {
          _id: "$accommodation_id",
          total_bookings: { $sum: 1 }
        }
      },
      {
        $sort: { total_bookings: -1 }
        },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "accommodations",
          localField: "_id",
          foreignField: "_id",
          as: "accommodation"
        }
      },
      {
        $unwind: {
          path: "$accommodation",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ["$accommodation.name", "Deleted Accommodation"] },
          category: { $ifNull: ["$accommodation.category", "Unknown"] },
          total_bookings: 1
        }
      }
    ]);

    const popularAccommodations = accommodationBookings;

    return res.json({
      success: true,
      reportYear: currentYear,

      bookingStatistics,
      paymentStatistics,

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