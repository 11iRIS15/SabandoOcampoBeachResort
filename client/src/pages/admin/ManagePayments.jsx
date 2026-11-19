import { useEffect, useState } from "react";
import api from "../../services/api";

function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPayments() {
      try {
        const response = await api.get("/admin/payments");
        setPayments(response.data.payments || response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load payment records."
        );
      }
    }

    loadPayments();
  }, []);

  async function updatePayment(id, status) {
    try {
      await api.patch(`/admin/payments/${id}/status`, { status });

      setPayments((previous) =>
        previous.map((payment) =>
          payment._id === id ? { ...payment, status } : payment
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update payment."
      );
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="section-label">FINANCIAL RECORDS</span>
          <h1>Manage Payments</h1>
          <p>Review payment records and payment statuses.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-table-card">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Booking Reference</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.bookingReference || payment.booking?._id}</td>
                  <td>{payment.customerName || payment.customer?.fullName}</td>
                  <td>₱{Number(payment.amount || 0).toLocaleString("en-PH")}</td>
                  <td>{payment.method || "Not specified"}</td>
                  <td>{payment.createdAt?.slice(0, 10) || "—"}</td>
                  <td>{payment.status}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={payment.status || "Pending"}
                      onChange={(event) =>
                        updatePayment(payment._id, event.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No payment records found.
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

export default ManagePayments;