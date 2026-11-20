import { useEffect, useState } from "react";
import api from "../../services/api";

function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await api.get("/admin/customers");

        setCustomers(response.data.customers || response.data || []);
      } catch (error) {
        console.error("Unable to load customers:", error);
        alert("Unable to load customer records.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const name = customer.full_name || customer.fullName || "";
    const email = customer.email || "";
    const phone = customer.phone || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <span className="section-label">CUSTOMER MANAGEMENT</span>
        <h1>Manage Customers</h1>
        <p>View registered resort customers.</p>
      </div>

      <div className="content-card">
        <div className="table-header">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <span>{customers.length} customers</span>
        </div>

        {loading ? (
          <p>Loading customers...</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date Registered</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      {customer.full_name || customer.fullName || "—"}
                    </td>

                    <td>{customer.email || "—"}</td>

                    <td>{customer.phone || "—"}</td>

                    <td>
                      {customer.created_at
                        ? new Date(customer.created_at).toLocaleDateString()
                        : customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageCustomers;