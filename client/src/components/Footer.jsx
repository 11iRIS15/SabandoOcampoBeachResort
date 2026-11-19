import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="d-flex align-items-center mb-3">
              <img
                src="/images/logo.png"
                alt="Resort logo"
                className="footer-logo me-3"
              />
              <h5 className="mb-0">Sabando Ocampo Beach Resort</h5>
            </div>

            <p>
              Relax and enjoy your beach getaway at Sabando Ocampo Beach
              Resort in Maramba, Oas, Albay.
            </p>
          </div>

          <div className="col-6 col-lg-3">
            <h6>Quick Links</h6>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/accommodations">Accommodations</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-4">
            <h6>Contact and Location</h6>
            <p><MapPin size={16} /> Maramba, Oas, Albay, Philippines</p>
            <p><Phone size={16} /> 09936890815</p>
            <p><Mail size={16} /> sobeachresort@gmail.com</p>
          </div>
        </div>

        <hr className="footer-divider" />

        <p className="text-center mb-0">
          © {new Date().getFullYear()} Sabando Ocampo Beach Resort.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;