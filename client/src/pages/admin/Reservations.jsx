
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import api from "../../services/api";

function Reservations() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBookings() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/mongodb/admin/bookings");
      setBookings(response.data.bookings || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load reservations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function updateStatus(id, status) {
    setError("");

    try {
      await api.put(`/mongodb/admin/bookings/${id}/status`, {
        status,
      });

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === id
            ? { ...booking, status }
            : booking
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update reservation status."
      );
    }
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="section-label">BOOKING MANAGEMENT</span>
          <h1>Reservations</h1>
          <p>Review and manage customer reservation requests.</p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadBookings}
          disabled={loading}
        >
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-table-card">
        {loading ? (
          <p>Loading reservations...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted">
            No reservation records found.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Accommodation</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      {booking.user?.full_name ||
                        booking.full_name ||
                        booking.fullName ||
                        booking.customer?.full_name ||
                        booking.customer?.fullName ||
                        "—"}

                      <small className="d-block text-muted">
                        {booking.user?.email ||
                          booking.email ||
                          booking.customer?.email ||
                          "—"}
                      </small>

                      {booking.booking_reference && (
                        <small className="d-block text-muted">
                          Ref: {booking.booking_reference}
                        </small>
                      )}
                    </td>

                    <td>
                      {booking.accommodation_id?.name ||
                        booking.accommodationName ||
                        booking.room?.name ||
                        "—"}
                    </td>

                    <td>
                      {formatDate(booking.check_in || booking.checkIn)}
                    </td>

                    <td>
                      {formatDate(booking.check_out || booking.checkOut)}
                    </td>

                    <td>{booking.guests ?? "—"}</td>

                    <td>{booking.status || "Pending"}</td>

                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={booking.status || "Pending"}
                        onChange={(event) =>
                          updateStatus(
                            booking._id,
                            event.target.value
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reservations;
