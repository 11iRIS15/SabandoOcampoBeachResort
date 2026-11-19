import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import api from "../../services/api";

function Reports() {
  const [report, setReport] = useState({
    totalBookings: 0,
    approvedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    payments: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await api.get("/admin/reports");
        setReport({
          totalBookings: response.data.totalBookings || 0,
          approvedBookings: response.data.approvedBookings || 0,
          pendingBookings: response.data.pendingBookings || 0,
          totalRevenue: response.data.totalRevenue || 0,
          payments: response.data.payments || [],
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load reports."
        );
      }
    }

    loadReport();
  }, []);

  function exportCSV() {
    const rows = [
      ["Booking Reference", "Customer", "Amount", "Payment Status"],
      ...report.payments.map((payment) => [
        payment.bookingReference || "",
        payment.customerName || "",
        payment.amount || 0,
        payment.status || "",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "sabando-resort-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="section-label">BUSINESS OVERVIEW</span>
          <h1>Reports</h1>
          <p>View reservation and payment summaries.</p>
        </div>

        <button className="btn btn-primary" onClick={exportCSV}>
          <Download size={17} /> Export CSV
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="admin-stat-card">
            <div>
              <p>Total Bookings</p>
              <h2>{report.totalBookings}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="admin-stat-card">
            <div>
              <p>Approved Bookings</p>
              <h2>{report.approvedBookings}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="admin-stat-card">
            <div>
              <p>Pending Bookings</p>
              <h2>{report.pendingBookings}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="admin-stat-card">
            <div>
              <p>Recorded Revenue</p>
              <h2>₱{report.totalRevenue.toLocaleString("en-PH")}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-table-card">
        <h4>Payment Summary</h4>

        <div className="table-responsive mt-3">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Booking Reference</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {report.payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.bookingReference}</td>
                  <td>{payment.customerName}</td>
                  <td>₱{Number(payment.amount || 0).toLocaleString("en-PH")}</td>
                  <td>{payment.status}</td>
                </tr>
              ))}

              {report.payments.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No payment data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;