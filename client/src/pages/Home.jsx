import { Link } from "react-router-dom";
import {
  Waves,
  Umbrella,
  House,
  MapPin,
  ArrowRight,
} from "lucide-react";

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay">
          <div className="container hero-content">
            <span className="hero-tag">YOUR BEACH GETAWAY</span>
            <h1>Welcome to Sabando Ocampo Beach Resort</h1>
            <p>
              Enjoy the beauty of the sea, relaxing accommodations,
              and memorable moments with family and friends.
            </p>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link to="/accommodations" className="btn btn-primary btn-lg">
                Explore Accommodations <ArrowRight size={18} />
              </Link>

              <Link to="/about" className="btn btn-outline-light btn-lg">
                Discover Our Resort
              </Link>
            </div>

            <p className="hero-location mt-4">
              <MapPin size={17} /> Maramba, Oas, Albay, Philippines
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img
                src="/images/resort-building.jpg"
                alt="Resort accommodation buildings"
                className="img-fluid rounded-4 shadow"
              />
            </div>

            <div className="col-lg-6">
              <span className="section-label">ABOUT THE RESORT</span>
              <h2 className="section-title">
                A Place to Relax and Enjoy the Sea
              </h2>

              <p>
                Sabando Ocampo Beach Resort is located in Maramba,
                Oas, Albay. The resort offers accommodation choices,
                beachfront cottages, and seaside attractions for guests
                visiting with family and friends.
              </p>

              <Link to="/about" className="btn btn-outline-primary mt-2">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container">
          <div className="text-center section-heading">
            <span className="section-label">STAY WITH US</span>
            <h2 className="section-title">Featured Accommodations</h2>
            <p>Choose an accommodation for your next beach visit.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <img src="/images/vip-twin.jpg" alt="VIP Twin room" />
                <div className="p-4">
                  <h5>VIP Twin</h5>
                  <p>Air-conditioned accommodation with a sea-view setting.</p>
                  <Link to="/accommodations">
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <img src="/images/vip-quad.jpg" alt="VIP Quad room" />
                <div className="p-4">
                  <h5>VIP Quad</h5>
                  <p>A room option for guests visiting as a small group.</p>
                  <Link to="/accommodations">
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <img
                  src="/images/beach-cottage-small.jpg"
                  alt="Small beach cottage"
                />
                <div className="p-4">
                  <h5>Beachfront Cottage</h5>
                  <p>Enjoy a cottage near the beach and seaside views.</p>
                  <Link to="/accommodations">
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/accommodations" className="btn btn-primary">
              View All Accommodations
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="text-center section-heading">
            <span className="section-label">ENJOY YOUR VISIT</span>
            <h2 className="section-title">Resort Highlights</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="highlight-card">
                <img
                  src="/images/floating-playground.jpg"
                  alt="Floating playground"
                />
                <div>
                  <Waves />
                  <h5>Floating Playground</h5>
                  <p>Enjoy the floating inflatable attraction on the sea.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="highlight-card">
                <img src="/images/ocean-view.jpg" alt="Ocean view" />
                <div>
                  <Umbrella />
                  <h5>Beach and Ocean Views</h5>
                  <p>Relax and appreciate the seaside surroundings.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="highlight-card">
                <img
                  src="/images/beach-cottage-medium.jpg"
                  alt="Medium beachfront cottage"
                />
                <div>
                  <House />
                  <h5>Beachfront Cottages</h5>
                  <p>Choose a cottage for your resort visit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="booking-banner">
        <div className="container text-center">
          <h2>Plan Your Next Beach Visit</h2>
          <p>Explore the accommodations and send a reservation request.</p>
          <Link to="/accommodations" className="btn btn-light btn-lg">
  Book Your Stay <ArrowRight size={18} />
</Link>
        </div>
      </section>
    </>
  );
}

export default Home;