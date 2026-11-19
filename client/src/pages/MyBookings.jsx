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

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await api.get("/bookings/my-bookings");
        setBookings(response.data.bookings || response.data);
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
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <span className="section-label">CUSTOMER ACCOUNT</span>
            <h1 className="section-title">My Bookings</h1>
            <p>Welcome, {user?.fullName || user?.name || "Guest"}.</p>
          </div>

          <Link to="/accommodations" className="btn btn-primary">
            Make a Reservation
          </Link>
        </div>

        {loading && <p>Loading your bookings...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

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

        {!loading && bookings.length > 0 && (
          <div className="row g-4">
            {bookings.map((booking) => (
              <div className="col-lg-6" key={booking._id || booking.id}>
                <div className="booking-history-card">
                  <div className="d-flex justify-content-between gap-3">
                    <h5>{booking.accommodationName || booking.roomName}</h5>
                    <span className={`booking-status ${String(booking.status || "pending").toLowerCase()}`}>
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  <p className="text-muted">
                    Reference: {booking.bookingReference || booking._id}
                  </p>

                  <p><CalendarDays size={17} /> Check-in: {booking.checkIn?.slice(0, 10)}</p>
                  <p><CalendarDays size={17} /> Check-out: {booking.checkOut?.slice(0, 10)}</p>
                  <p><Clock size={17} /> Guests: {booking.guests}</p>

                  <hr />

                  <p className="mb-0">
                    <strong>Booking status:</strong> {booking.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyBookings;