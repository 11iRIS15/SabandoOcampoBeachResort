
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, ClipboardList } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function MyBookings() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (amount == null || isNaN(Number(amount))) return "N/A";

    return Number(amount).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });
  };

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await api.get("/mongodb/bookings/my");

        const bookingData =
          response.data.bookings || response.data.data || response.data;

        setBookings(Array.isArray(bookingData) ? bookingData : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your bookings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  return (
    <section className="section-padding bg-soft">
      <div className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <span className="section-label">CUSTOMER ACCOUNT</span>
            <h1 className="section-title">My Bookings</h1>
            <p>
              Welcome,{" "}
              {user?.full_name || user?.fullName || user?.name || "Guest"}.
            </p>
          </div>

          <Link to="/accommodations" className="btn btn-primary">
            Make a Reservation
          </Link>
        </div>

        {/* LOADING */}
        {loading && <p>Loading your bookings...</p>}

        {/* ERROR */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* EMPTY BOOKINGS */}
        {!loading && !error && bookings.length === 0 && (
          <div className="empty-bookings">
            <ClipboardList size={45} />
            <h4>No bookings yet</h4>
            <p>You have not submitted any reservation requests.</p>

            <Link to="/accommodations" className="btn btn-primary">
              Browse Accommodations
            </Link>
          </div>
        )}

        {/* BOOKING LIST */}
        {!loading && !error && bookings.length > 0 && (
          <div className="row g-4">
            {bookings.map((booking) => {
              const accommodation =
                booking.accommodation_id &&
                typeof booking.accommodation_id === "object"
                  ? booking.accommodation_id
                  : booking.accommodation &&
                    typeof booking.accommodation === "object"
                  ? booking.accommodation
                  : null;

              const accommodationName =
                accommodation?.name ||
                booking.accommodationName ||
                booking.roomName ||
                "Accommodation";

              const bookingReference =
                booking.booking_reference ||
                booking.bookingReference ||
                booking._id ||
                booking.id ||
                "N/A";

              const checkIn = booking.check_in || booking.checkIn;
              const checkOut = booking.check_out || booking.checkOut;

              const guests =
                booking.guests ??
                booking.number_of_guests ??
                booking.guest_count ??
                "N/A";

              const status = booking.status || "Pending";

              const totalAmount =
                booking.total_price ??
                booking.total_amount ??
                booking.totalPrice ??
                booking.amount;

              return (
                <div
                  className="col-lg-6"
                  key={booking._id || booking.id}
                >
                  <div className="booking-history-card">
                    {/* BOOKING HEADER */}
                    <div className="d-flex justify-content-between gap-3">
                      <h5>{accommodationName}</h5>

                      <span
                        className={`booking-status ${String(status).toLowerCase()}`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* REFERENCE */}
                    <p className="text-muted">
                      Reference: {bookingReference}
                    </p>

                    {/* DATES */}
                    <p>
                      <CalendarDays size={17} /> Check-in:{" "}
                      {formatDate(checkIn)}
                    </p>

                    <p>
                      <CalendarDays size={17} /> Check-out:{" "}
                      {formatDate(checkOut)}
                    </p>

                    {/* GUESTS */}
                    <p>
                      <Clock size={17} /> Guests: {guests}
                    </p>

                    {/* TOTAL AMOUNT */}
                    {totalAmount != null && (
                      <p>
                        <strong>Total Amount:</strong>{" "}
                        {formatCurrency(totalAmount)}
                      </p>
                    )}

                    <hr />

                    {/* BOOKING STATUS */}
                    <p className="mb-0">
                      <strong>Booking status:</strong> {status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyBookings;
