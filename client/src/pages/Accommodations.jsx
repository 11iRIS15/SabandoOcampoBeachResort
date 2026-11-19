import { Link } from "react-router-dom";
import { Users, BedDouble, ArrowRight } from "lucide-react";

const regularRooms = [
  {
    id: "native-ordinary",
    name: "Native Ordinary",
    price: 1000,
    guests: 2,
    units: 2,
    image: "/images/resort-building.jpg",
    description: "Native-style accommodation for a relaxing beach visit.",
  },
  {
    id: "native-aircon",
    name: "Native Aircon",
    price: 1500,
    guests: 2,
    units: 2,
    image: "/images/resort-building.jpg",
    description: "Native-style accommodation with air-conditioning.",
  },
  {
    id: "deluxe-twin",
    name: "Deluxe Twin",
    price: 1800,
    guests: 2,
    units: 2,
    image: "/images/resort-building.jpg",
    description: "A twin accommodation option for resort guests.",
  },
  {
    id: "vip-twin",
    name: "VIP Twin",
    price: 2000,
    guests: 2,
    units: 2,
    image: "/images/vip-twin.jpg",
    description:
      "Air-conditioned room with toilet and bath, cable TV, and refrigerator.",
  },
  {
    id: "chalet",
    name: "Chalet",
    price: 2300,
    guests: 2,
    units: 2,
    image: "/images/beach-cabanna.jpg",
    description: "A chalet accommodation option at the resort.",
  },
  {
    id: "deluxe-quad",
    name: "Deluxe Quad",
    price: 3400,
    guests: 4,
    units: 2,
    image: "/images/resort-building.jpg",
    description: "An accommodation option for up to four guests.",
  },
  {
    id: "vip-quad",
    name: "VIP Quad",
    price: 3500,
    guests: 4,
    units: 1,
    image: "/images/vip-quad.jpg",
    description:
      "Air-conditioned room with two double-sized beds and sea-view setting.",
  },
  {
    id: "deluxe-family-6",
    name: "Deluxe Family",
    price: 4800,
    guests: 6,
    units: 1,
    image: "/images/resort-building.jpg",
    description: "Family accommodation listing for six guests.",
  },
  {
    id: "deluxe-family-8",
    name: "Deluxe Family",
    price: 6800,
    guests: 8,
    units: 6,
    image: "/images/resort-building.jpg",
    description: "Family accommodation listing for eight guests.",
  },
  {
    id: "main-house",
    name: "Main House",
    price: 10800,
    guests: 12,
    units: 1,
    image: "/images/resort-building.jpg",
    description: "The main house accommodation listing.",
  },
];

const soriRooms = [
  {
    id: "sori-cabana-2",
    name: "Cabana",
    price: 1800,
    guests: 2,
    units: 2,
    image: "/images/beach-cabanna.jpg",
    description: "Sori Annex cabana listing for two guests.",
  },
  {
    id: "sori-cabana-3",
    name: "Cabana",
    price: 2500,
    guests: 3,
    units: 2,
    image: "/images/beach-cabanna.jpg",
    description: "Sori Annex cabana listing for three guests.",
  },
  {
    id: "sori-standard",
    name: "Standard Room",
    price: 3200,
    guests: 4,
    units: 1,
    image: "/images/beach-standard.jpg",
    description: "Sori Annex standard room listing.",
  },
  {
    id: "sori-dormitory",
    name: "Dormitory Type UP/DOWN",
    price: 8000,
    guests: 10,
    units: 1,
    image: "/images/beach-standard.jpg",
    description: "Dormitory-style accommodation for a group.",
  },
  {
    id: "sori-dormitory-cottage",
    name: "Dormitory Type with Cottage",
    price: 9000,
    guests: 10,
    units: 1,
    image: "/images/beach-cottage-medium.jpg",
    description: "Dormitory-style accommodation with cottage.",
  },
];

function RoomCard({ room }) {
  return (
    <div className="col-md-6 col-lg-4">
      <article className="room-card h-100">
        <img src={room.image} alt={room.name} />

        <div className="p-4">
          <h5>{room.name}</h5>
          <p className="text-muted">{room.description}</p>

          <div className="room-information">
            <span><Users size={16} /> {room.guests} guests</span>
            <span><BedDouble size={16} /> {room.units} unit(s)</span>
          </div>

          <div className="room-price">
            ₱{room.price.toLocaleString("en-PH")}
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

          <div className="section-heading">
            <span className="section-label">ROOMS AND COTTAGES</span>
            <h2 className="section-title">Regular Rates</h2>
          </div>

          <div className="row g-4">
            {regularRooms.map((room) => (
              <RoomCard room={room} key={room.id} />
            ))}
          </div>

          <div className="section-heading mt-5">
            <span className="section-label">SORI ANNEX</span>
            <h2 className="section-title">Sori Annex Rates</h2>
          </div>

          <div className="row g-4">
            {soriRooms.map((room) => (
              <RoomCard room={room} key={room.id} />
            ))}
          </div>

          <div className="notice-box mt-5">
            <h5>Excess Guest Charges on the 2025 Rate Board</h5>
            <p className="mb-1">Adult: ₱400 per head</p>
            <p className="mb-0">Child: ₱300 per head</p>
            <small>
              Confirm the resort's current age definitions and excess-person
              rules before using these amounts in a real booking calculation.
            </small>
          </div>
        </div>
      </section>
    </>
  );
}

export default Accommodations;