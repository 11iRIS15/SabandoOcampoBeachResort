
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
            <small> / per night or rate</small>
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

      const roomData = accommodationData
        .filter((item) => item.is_active !== false)
        .map((item) => ({
          id: item._id || item.id || item.accommodation_code,
          name: item.name,
          price: Number(item.price || 0),
          guests: item.capacity || 0,
          units: item.quantity || 1,
          image: item.image,
          description: item.description,
          category: item.category || "Other",
          accommodation_code: item.accommodation_code,
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

  const groupedRooms = rooms.reduce((groups, room) => {
    const category = room.category || "Other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(room);

    return groups;
  }, {});

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
            <strong>Rate information:</strong> Accommodation rates are
            displayed based on the available resort records. Please
            confirm current rates, capacity, and availability with
            the resort before accepting reservations.
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>

              <p className="mt-3">Loading accommodations...</p>
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

          {!loading && !error && rooms.length > 0 && (
            <>
              {Object.entries(groupedRooms).map(([category, categoryRooms]) => (
                <div key={category} className="mb-5">
                  <div className="section-heading">
                    <span className="section-label">
                      ACCOMMODATION
                    </span>

                    <h2 className="section-title">
                      {category === "Other"
                        ? "Cottages, Beach Areas & Other Accommodations"
                        : category}
                    </h2>
                  </div>

                  <div className="row g-4">
                    {categoryRooms.map((room) => (
                      <RoomCard room={room} key={room.id} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Accommodations;
