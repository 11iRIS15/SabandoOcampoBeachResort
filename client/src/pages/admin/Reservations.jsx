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
      const response = await api.get("/admin/bookings");
      setBookings(response.data.bookings || response.data);
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
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update reservation status."
      );
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="section-label">BOOKING MANAGEMENT</span>
          <h1>Reservations</h1>
          <p>Review and manage customer reservation requests.</p>
        </div>

        <button className="btn btn-outline-primary" onClick={loadBookings}>
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-table-card">
        {loading ? (
          <p>Loading reservations...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted">No reservation records found.</p>
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
                      {booking.fullName || booking.customer?.fullName}
                      <small className="d-block text-muted">
                        {booking.email || booking.customer?.email}
                      </small>
                    </td>

                    <td>{booking.accommodationName || booking.room?.name}</td>
                    <td>{booking.checkIn?.slice(0, 10)}</td>
                    <td>{booking.checkOut?.slice(0, 10)}</td>
                    <td>{booking.guests}</td>
                    <td>{booking.status}</td>

                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={booking.status || "Pending"}
                        onChange={(event) =>
                          updateStatus(booking._id, event.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Cancelled">Cancelled</option>
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