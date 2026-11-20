
import { useEffect, useState } from "react";
import api from "../../services/api";

function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function loadPayments() {
      try {
        const response = await api.get("/admin/payments");

        setPayments(
          response.data.payments ||
            response.data.data ||
            []
        );
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
      setUpdatingId(id);
      setError("");

      await api.patch(`/admin/payments/${id}/status`, {
        status: status.toLowerCase(),
      });

      setPayments((previous) =>
        previous.map((payment) =>
          payment._id === id
            ? {
                ...payment,
                payment_status: status.toLowerCase(),
              }
            : payment
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update payment."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatAmount(amount) {
    return Number(amount || 0).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });
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
              {payments.map((payment) => {
                const status =
                  payment.payment_status ||
                  payment.status ||
                  "pending";

                const booking =
                  typeof payment.booking === "object"
                    ? payment.booking
                    : null;

                const customer =
                  booking?.user ||
                  payment.user ||
                  payment.customer ||
                  null;

                const bookingReference =
                  booking?.booking_reference ||
                  booking?._id ||
                  payment.booking_reference ||
                  payment.booking_id ||
                  "N/A";

                const customerName =
                  booking?.full_name ||
                  customer?.full_name ||
                  customer?.fullName ||
                  customer?.name ||
                  "—";

                const amount =
                  payment.amount ??
                  payment.total_amount ??
          payment.total_price ??
                  0;

                const paymentMethod =
                  payment.payment_method ||
                  payment.method ||
          "Not specified";

                const paymentDate =
                  payment.created_at ||
                  payment.createdAt ||
                  payment.payment_date;

                return (
                  <tr key={payment._id}>
                    <td>{bookingReference}</td>

                    <td>{customerName}</td>

                    <td>{formatAmount(amount)}</td>

                    <td>{paymentMethod}</td>

                    <td>{formatDate(paymentDate)}</td>

                    <td>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1)}
                    </td>

                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={status.toLowerCase()}
                        disabled={updatingId === payment._id}
                        onChange={(event) =>
                          updatePayment(
                            payment._id,
                            event.target.value
                          )
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                  </tr>
                );
              })}

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
