import { Link } from "react-router-dom";

function CustomerDashboard() {

  // Temporary sample information.
  // Replace with authenticated customer data later.

  const customer = {
    fullName: "Juan Dela Cruz",
    email: "juan@example.com"
  };

  const bookings = [
    {
      id: "SBR-001",
      accommodation: "VIP Quad",
      checkIn: "2026-12-20",
      checkOut: "2026-12-22",
      status: "Pending",
      payment: "Unpaid"
    },
    {
      id: "SBR-002",
      accommodation: "Native Aircon",
      checkIn: "2026-12-25",
      checkOut: "2026-12-26",
      status: "Confirmed",
      payment: "Verified"
    }
  ];

  return (
    <div className="container-fluid py-4">

      <div className="container">

        <div className="mb-4">
          <h2>
            Welcome, {customer.fullName}!
          </h2>

          <p className="text-muted">
            Manage your Sabando Ocampo Beach Resort reservations.
          </p>
        </div>

        {/* Statistics */}

        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h6>Total Reservations</h6>
              <h2>{bookings.length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h6>Pending Reservations</h6>
              <h2>
                {bookings.filter(
                  b => b.status === "Pending"
                ).length}
              </h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h6>Confirmed Reservations</h6>
              <h2>
                {bookings.filter(
                  b => b.status === "Confirmed"
                ).length}
              </h2>
            </div>
          </div>

        </div>

        {/* Profile */}

        <div className="card shadow-sm p-4 mb-4">

          <h4>My Profile</h4>

          <p>
            <strong>Name:</strong> {customer.fullName}
          </p>

          <p>
            <strong>Email:</strong> {customer.email}
          </p>

        </div>

        {/* Booking History */}

        <div className="card shadow-sm p-4">

          <div className="d-flex justify-content-between mb-3">

            <h4>My Reservations</h4>

            <Link
              to="/accommodations"
              className="btn btn-primary"
            >
              New Reservation
            </Link>

          </div>

          <div className="table-responsive">

            <table className="table table-bordered table-hover">

              <thead className="table-dark">
                <tr>
                  <th>Booking ID</th>
                  <th>Accommodation</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>

                {bookings.map(booking => (

                  <tr key={booking.id}>

                    <td>{booking.id}</td>

                    <td>{booking.accommodation}</td>

                    <td>{booking.checkIn}</td>

                    <td>{booking.checkOut}</td>

                    <td>
                      <span className={`badge ${
                        booking.status === "Confirmed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}>
                        {booking.status}
                      </span>
                    </td>

                    <td>{booking.payment}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CustomerDashboard;