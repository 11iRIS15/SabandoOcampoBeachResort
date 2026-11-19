
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, BedDouble, ArrowRight } from "lucide-react";
import api from "../services/api";

function RoomCard({ room }) {
  return (
    <div className="col-md-6 col-lg-4">
      <article className="room-card h-100">
        <img
          src={room.image || "/images/resort-building.jpg"}
          alt={room.name}
          onError={(e) => {
            e.currentTarget.src = "/images/resort-building.jpg";
          }}
        />

        <div className="p-4">
          <h5>{room.name}</h5>

          <p className="text-muted">
            {room.description || "Enjoy a relaxing stay at our beach resort."}
          </p>

          <div className="room-information">
            <span>
              <Users size={16} /> {room.guests} guests
            </span>

            <span>
              <BedDouble size={16} /> {room.units} unit(s)
            </span>
          </div>

          <div className="room-price">
            ₱{Number(room.price).toLocaleString("en-PH")}
            <small> / rate shown on 2025 board</small>
          </div>

          <Link
            to={`/booking/${room.id}`}
            className="btn btn-primary w-100 mt-3"
          >
            Request Booking <ArrowRight size={16} />
          </Link>
        </div>
      </article>
    </div>
  );
}

function Accommodations() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAccommodations();
  }, []);

  async function fetchAccommodations() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/accommodations");

      const accommodationData = response.data.accommodations || [];

      // Keep only room accommodations.
      // Beach facilities and other non-room records are excluded.
      const roomData = accommodationData
        .filter((item) => {
          const category = String(item.category || "").toLowerCase();
          return category === "room" || category === "sori annex";
        })
        .map((item) => ({
          id: item.accommodation_code,
          name: item.name,
          price: Number(item.price),
          guests: item.capacity,
          units: item.quantity,
          image: item.image,
          description: item.description,
          category: item.category,
        }));

      setRooms(roomData);
    } catch (err) {
      console.error("Failed to load accommodations:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load accommodations. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  }

  const regularRooms = rooms.filter(
    (room) => room.category.toLowerCase() === "room"
  );

  const soriRooms = rooms.filter(
    (room) => room.category.toLowerCase() === "sori annex"
  );

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">ROOMS AND COTTAGES</span>
          <h1>Our Accommodations</h1>
          <p>Explore the accommodation choices at our beach resort.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">

          <div className="notice-box mb-5">
            <strong>Rate information:</strong> The prices shown are taken
            from the resort's 2025 rate board supplied for this project.
            Please confirm current rates, capacity, and availability with
            the resort before accepting reservations.
          </div>

          {loading && (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>

              <p className="mt-3">
                Loading accommodations...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="alert alert-danger text-center">
              <p>{error}</p>

              <button
                className="btn btn-primary"
                onClick={fetchAccommodations}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && rooms.length === 0 && (
            <div className="alert alert-info text-center">
              No accommodations are currently available.
            </div>
          )}

          {!loading && !error && (
            <>
              {regularRooms.length > 0 && (
                <>
                  <div className="section-heading">
                    <span className="section-label">
                      ROOMS AND COTTAGES
                    </span>

                    <h2 className="section-title">
                      Regular Rates
                    </h2>
                  </div>

                  <div className="row g-4">
                    {regularRooms.map((room) => (
                      <RoomCard room={room} key={room.id} />
                    ))}
                  </div>
                </>
              )}

              {soriRooms.length > 0 && (
                <>
                  <div className="section-heading mt-5">
                    <span className="section-label">
                      SORI ANNEX
                    </span>

                    <h2 className="section-title">
                      Sori Annex Rates
                    </h2>
                  </div>

                  <div className="row g-4">
                    {soriRooms.map((room) => (
                      <RoomCard room={room} key={room.id} />
                    ))}
                  </div>
                </>
              )}

              <div className="notice-box mt-5">
                <h5>Excess Guest Charges on the 2025 Rate Board</h5>

                <p className="mb-1">Adult: ₱400 per head</p>
                <p className="mb-0">Child: ₱300 per head</p>

                <small>
                  Confirm the resort's current age definitions and
                  excess-person rules before using these amounts
                  in a real booking calculation.
                </small>
              </div>
            </>
          )}

        </div>
      </section>
    </>
  );
}

export default Accommodations;
