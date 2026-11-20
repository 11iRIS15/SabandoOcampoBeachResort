
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  House,
  CreditCard,
} from "lucide-react";
import api from "../../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    reservations: 0,
    customers: 0,
    accommodations: 0,
    payments: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get("/admin/dashboard");

        setStats((previous) => ({
          ...previous,
          ...(response.data.stats || {}),
        }));

        setRecentBookings(response.data.recentBookings || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard information. Check the backend."
        );
      }
    }

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Total Reservations",
      value: stats.reservations,
      icon: <CalendarDays />,
    },
    {
      title: "Registered Customers",
      value: stats.customers,
      icon: <Users />,
    },
    {
      title: "Accommodations",
      value: stats.accommodations,
      icon: <House />,
    },
    {
      title: "Payments",
      value: stats.payments,
      icon: <CreditCard />,
    },
  ];

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
          <span className="section-label">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Welcome to the resort management dashboard.</p>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="row g-4 mb-4">
        {cards.map((card) => (
          <div className="col-sm-6 col-xl-3" key={card.title}>
            <div className="admin-stat-card">
              <div>
                <p>{card.title}</p>
                <h2>{card.value}</h2>
              </div>
              <span>{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-table-card">
        <h4>Recent Reservations</h4>

        {recentBookings.length === 0 ? (
          <p className="text-muted mt-3">
            No recent reservation records are available.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Accommodation</th>
                  <th>Check-in</th>
                  <th>Guests</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      {booking.user?.full_name ||
                        booking.full_name ||
                        booking.fullName ||
                        booking.customer?.full_name ||
                        booking.customer?.fullName ||
                        "—"}
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

                    <td>{booking.guests ?? "—"}</td>

                    <td>{booking.status || "Pending"}</td>
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

export default Dashboard;
