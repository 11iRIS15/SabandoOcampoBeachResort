import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../../services/api";

function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await api.get("/admin/customers");
        setCustomers(response.data.customers || response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load customer records."
        );
      }
    }

    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.fullName?.toLowerCase().includes(searchText) ||
      customer.email?.toLowerCase().includes(searchText) ||
      customer.phone?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="section-label">CUSTOMER MANAGEMENT</span>
          <h1>Manage Customers</h1>
          <p>View registered resort customers.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-table-card">
        <div className="search-box mb-4">
          <Search size={18} />
          <input
            type="search"
            className="form-control"
            placeholder="Search by name, email, or contact number"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email Address</th>
                <th>Contact Number</th>
                <th>Registered Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.fullName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || "—"}</td>
                  <td>{customer.createdAt?.slice(0, 10) || "—"}</td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No customers found.
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

export default ManageCustomers;