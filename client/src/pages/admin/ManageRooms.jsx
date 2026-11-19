import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../services/api";

const emptyRoom = {
  name: "",
  category: "Regular",
  description: "",
  price: "",
  capacity: "",
  quantity: "",
  image: "",
};

function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyRoom);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function loadRooms() {
    try {
      const response = await api.get("/admin/accommodations");
      setRooms(response.data.accommodations || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load accommodations."
      );
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function startEdit(room) {
    setEditingId(room._id);
    setForm({
      name: room.name || "",
      category: room.category || "Regular",
      description: room.description || "",
      price: room.price ?? "",
      capacity: room.capacity ?? "",
      quantity: room.quantity ?? "",
      image: room.image || "",
    });
    setShowForm(true);
  }

  function resetForm() {
    setForm(emptyRoom);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const roomData = {
      ...form,
      price: Number(form.price),
      capacity: Number(form.capacity),
      quantity: Number(form.quantity),
    };

    try {
      if (editingId) {
        await api.put(`/admin/accommodations/${editingId}`, roomData);
      } else {
        await api.post("/admin/accommodations", roomData);
      }

      resetForm();
      loadRooms();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save accommodation."
      );
    }
  }

  async function deleteRoom(id) {
    if (!window.confirm("Are you sure you want to delete this accommodation?")) {
      return;
    }

    try {
      await api.delete(`/admin/accommodations/${id}`);
      loadRooms();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete accommodation."
      );
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="section-label">RESORT MANAGEMENT</span>
          <h1>Manage Accommodations</h1>
          <p>Add, edit, and manage room and cottage information.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={17} /> Add Accommodation
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="admin-table-card mb-4">
          <h4>{editingId ? "Edit Accommodation" : "Add Accommodation"}</h4>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Accommodation Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Regular">Regular</option>
                  <option value="Sori Annex">Sori Annex</option>
                </select>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="2"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Guest Capacity</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Number of Units</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Image Path or URL</label>
                <input
                  className="form-control"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="/images/vip-twin.jpg"
                />
              </div>
            </div>

            <button className="btn btn-primary me-2">
              {editingId ? "Save Changes" : "Add Accommodation"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="admin-table-card">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Capacity</th>
                <th>Units</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.name}</td>
                  <td>{room.category}</td>
                  <td>₱{Number(room.price).toLocaleString("en-PH")}</td>
                  <td>{room.capacity}</td>
                  <td>{room.quantity}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => startEdit(room)}
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteRoom(room._id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {rooms.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No accommodation records found.
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

export default ManageRooms;