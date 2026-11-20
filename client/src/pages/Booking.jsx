
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

  // Load accommodations from MongoDB
  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoadingRooms(true);
        setRoomError("");

        const response = await api.get("/accommodations");

        const accommodationData =
          response.data.accommodations ||
          response.data.data ||
          [];

        // Include all active accommodations
        const roomData = accommodationData
          .filter((item) => item.is_active !== false)
          .map((item) => ({
            id: item._id || item.id,
            code: item.accommodation_code,
            name: item.name,
            price: Number(item.price || 0),
            guests: Number(item.capacity || 1),
            units: Number(item.quantity || 1),
            image: item.image,
            description: item.description,
            category: item.category || "Other",
          }))
          .filter((item) => item.id);

        setRooms(roomData);

        // Automatically select the accommodation from the URL
        if (id) {
          const matchingRoom = roomData.find(
            (room) => room.id === id || room.code === id
          );

          if (matchingRoom) {
            setForm((previous) => ({
              ...previous,
              accommodationId: matchingRoom.id,
            }));
          }
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

  // Update customer information when the authenticated user is available
  useEffect(() => {
    if (!user) return;

    setForm((previous) => ({
      ...previous,
      fullName:
        user.full_name ||
        user.fullName ||
        user.name ||
        previous.fullName,
      email: user.email || previous.email,
      phone: user.phone || previous.phone,
    }));
  }, [user]);

  // Find the selected accommodation
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

    setError("");
  }

  // Calculate the number of nights
  function calculateNights() {
    if (!form.checkIn || !form.checkOut) return 0;

    const checkInDate = new Date(`${form.checkIn}T00:00:00`);
    const checkOutDate = new Date(`${form.checkOut}T00:00:00`);

    const difference = checkOutDate - checkInDate;

    return Math.max(
      0,
      Math.round(difference / (1000 * 60 * 60 * 24))
    );
  }

  const nights = calculateNights();

  const estimatedTotal = selectedRoom
    ? selectedRoom.price * nights
    : 0;

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.accommodationId ||
      !form.checkIn ||
      !form.checkOut ||
      !form.guests
    ) {
      setError("Please complete all required booking fields.");
      return;
    }

    if (!selectedRoom) {
      setError("Please select a valid accommodation.");
      return;
    }

    const checkInDate = new Date(`${form.checkIn}T00:00:00`);
    const checkOutDate = new Date(`${form.checkOut}T00:00:00`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setError("Check-in date cannot be in the past.");
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError("Check-out must be later than check-in.");
      return;
    }

    if (Number(form.guests) > selectedRoom.guests) {
      setError(
        `The maximum guest capacity for this accommodation is ${selectedRoom.guests}.`
      );
      return;
    }

    if (Number(form.guests) < 1) {
      setError("Number of guests must be at least 1.");
      return;
    }

    setLoading(true);

    try {
      // IMPORTANT:
      // These property names now match bookingMongoController.js
      const bookingData = {
        accommodation_id: selectedRoom.id,
        check_in: form.checkIn,
        check_out: form.checkOut,
        guests: Number(form.guests),
        special_requests: form.requests.trim(),
      };

      console.log("Booking payload:", bookingData);

      const response = await api.post(
        "/mongodb/bookings",
        bookingData
      );

      setSuccess(
        response.data.message ||
          "Your reservation request was submitted successfully."
      );

      setTimeout(() => {
        navigate("/my-bookings");
      }, 1500);
    } catch (err) {
      console.error("Booking submission failed:", err);
      console.error("Booking server response:", err.response?.data);

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

            <h1 className="section-title">Book Your Stay</h1>

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
                Rate per night: ₱
                {selectedRoom.price.toLocaleString("en-PH")}
              </p>

              <p className="mb-0">
                Maximum capacity: {selectedRoom.guests} guests
              </p>

              {form.checkIn && form.checkOut && nights > 0 && (
                <>
                  <hr />

                  <p className="mb-1">
                    Number of nights: {nights}
                  </p>

                  <h5 className="mb-0">
                    Estimated total: ₱
                    {estimatedTotal.toLocaleString("en-PH")}
                  </h5>
                </>
              )}
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
                  type="text"
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
                  min={new Date().toISOString().split("T")[0]}
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
                    new Date().toISOString().split("T")[0]
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
                  max={selectedRoom?.guests || 1}
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
