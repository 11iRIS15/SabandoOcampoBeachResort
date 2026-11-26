import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm resort-navbar">
      <div className="container">
        {/* Resort Logo and Brand */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center"
          onClick={closeMenu}
        >
          <img
            src="/images/logo.png"
            alt="Sabando Ocampo Beach Resort"
            className="navbar-logo me-2"
          />
          <span className="brand-name">Sabando Ocampo</span>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          className={`navbar-toggler ${menuOpen ? "menu-open" : ""}`}
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="resortNavbar"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="resortNavbar"
        >
          <div className="navbar-nav ms-auto align-items-lg-center resort-nav-links">
            <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>
              About
            </NavLink>

            <NavLink
              to="/accommodations"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Accommodations
            </NavLink>

            <NavLink
              to="/contact"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Contact
            </NavLink>

            {isAuthenticated ? (
              <>
                {user?.role === "admin" ? (
                  <Link to="/admin" className="nav-link" onClick={closeMenu}>
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/my-bookings"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    My Bookings
                  </Link>
                )}

                <button
                  className="btn btn-outline-danger nav-action-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Login
                </NavLink>

                <Link
                  to="/register"
                  className="btn btn-primary nav-action-btn"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}

            <Link
              to="/accommodations"
              className="btn btn-book nav-action-btn"
              onClick={closeMenu}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;