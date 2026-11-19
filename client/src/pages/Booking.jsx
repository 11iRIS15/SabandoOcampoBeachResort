
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomError, setRoomError] = useState("");

  const [form, setForm] = useState({
    fullName: user?.full_name || user?.fullName || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    accommodationId: id || "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    requests: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get accommodations from the backend.
  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoadingRooms(true);
        setRoomError("");

        const response = await api.get("/accommodations");

        const accommodationData = response.data.accommodations || [];

        const roomData = accommodationData
          .filter((item) => {
            const category = String(item.category || "").toLowerCase();

            return category === "room" || category === "sori annex";
          })
          .map((item) => ({
            id: item.accommodation_code,
            name: item.name,
            price: Number(item.price),
            guests: Number(item.capacity),
            units: Number(item.quantity),
            image: item.image,
            description: item.description,
            category: item.category,
          }));

        setRooms(roomData);

        // Select the accommodation from the URL.
        if (id && roomData.some((room) => room.id === id)) {
          setForm((previous) => ({
            ...previous,
            accommodationId: id,
          }));
        }
      } catch (err) {
        console.error("Failed to load accommodations:", err);

        setRoomError(
          err.response?.data?.message ||
            "Unable to load accommodations. Please check your backend connection."
        );
      } finally {
        setLoadingRooms(false);
      }
    }

    fetchRooms();
  }, [id]);

  // Find the selected accommodation.
  const selectedRoom = rooms.find(
    (room) => room.id === form.accommodationId
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "accommodationId" ? { guests: 1 } : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!selectedRoom) {
      setError("Please select a valid accommodation.");
      return;
    }

    const checkIn = new Date(`${form.checkIn}T00:00:00`);
    const checkOut = new Date(`${form.checkOut}T00:00:00`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      setError("Check-in date cannot be in the past.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out must be later than check-in.");
      return;
    }

    if (Number(form.guests) > selectedRoom.guests) {
      setError(
        `The maximum guest capacity for this accommodation is ${selectedRoom.guests}.`
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/bookings", {
        accommodationId: selectedRoom.id,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        requests: form.requests,
      });

      setSuccess(
        response.data.message ||
          "Your reservation request was submitted successfully."
      );

      setTimeout(() => {
        navigate("/my-bookings");
      }, 1500);
    } catch (err) {
      console.error("Booking submission failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to submit your booking. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-padding bg-soft">
      <div className="container">
        <div className="booking-form-card">

          <div className="text-center mb-4">
            <span className="section-label">
              RESERVATION REQUEST
            </span>

            <h1 className="section-title">
              Book Your Stay
            </h1>

            <p>
              Complete the form to request your accommodation.
            </p>
          </div>

          {!isAuthenticated && (
            <div className="alert alert-info">
              You need to <Link to="/login">log in</Link> before
              submitting a reservation.
            </div>
          )}

          {roomError && (
            <div className="alert alert-danger">
              {roomError}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {loadingRooms && (
            <div className="text-center py-3">
              Loading accommodation information...
            </div>
          )}

          {!loadingRooms && selectedRoom && (
            <div className="selected-room mb-4">
              <h5>{selectedRoom.name}</h5>

              <p className="mb-1">
                Historical 2025 rate: ₱
                {selectedRoom.price.toLocaleString("en-PH")}
              </p>

              <p className="mb-0">
                Listed capacity: {selectedRoom.guests} guests
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h5 className="form-section-title">
              Customer Information
            </h5>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Full Name
                </label>

                <input
                  className="form-control"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Email Address
                </label>

                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">
                Contact Number
              </label>

              <input
                type="tel"
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <hr />

            <h5 className="form-section-title">
              Booking Details
            </h5>

            <div className="mb-3">
              <label className="form-label">
                Accommodation
              </label>

              <select
                className="form-select"
                name="accommodationId"
                value={form.accommodationId}
                onChange={handleChange}
                required
                disabled={loadingRooms || Boolean(roomError)}
              >
                <option value="">
                  Select accommodation
                </option>

                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - ₱
                    {room.price.toLocaleString("en-PH")} (
                    {room.guests} guests)
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Check-in Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="checkIn"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={form.checkIn}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Check-out Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="checkOut"
                  min={
                    form.checkIn ||
                    new Date().toLocaleDateString("en-CA")
                  }
                  value={form.checkOut}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Number of Guests
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="guests"
                  min="1"
                  max={selectedRoom?.guests || undefined}
                  value={form.guests}
                  onChange={handleChange}
                  required
                />

                {selectedRoom && (
                  <small className="text-muted">
                    Maximum: {selectedRoom.guests} guests
                  </small>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">
                Additional Requests
              </label>

              <textarea
                className="form-control"
                rows="4"
                name="requests"
                value={form.requests}
                onChange={handleChange}
                placeholder="Enter any additional requests..."
              />
            </div>

            <button
              className="btn btn-primary btn-lg w-100"
              type="submit"
              disabled={
                loading ||
                loadingRooms ||
                Boolean(roomError) ||
                !selectedRoom
              }
            >
              {loading
                ? "Submitting..."
                : "Submit Reservation Request"}
            </button>

            <p className="small text-muted mt-3">
              Submitting a request does not mean the reservation
              is confirmed. The resort must verify availability
              and approve the booking.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Booking;
