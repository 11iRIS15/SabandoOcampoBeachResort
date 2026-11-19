import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="/images/logo.png"
            alt="Sabando Ocampo Beach Resort"
            className="navbar-logo me-2"
          />
          <span className="brand-name">Sabando Ocampo</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#resortNavbar"
          aria-controls="resortNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="resortNavbar">
          <div className="navbar-nav ms-auto align-items-lg-center">
            <NavLink to="/" end className="nav-link">Home</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
            <NavLink to="/accommodations" className="nav-link">
              Accommodations
            </NavLink>
            <NavLink to="/contact" className="nav-link">Contact</NavLink>

            {isAuthenticated ? (
              <>
                {user?.role === "admin" ? (
                  <Link to="/admin" className="nav-link">Admin Panel</Link>
                ) : (
                  <Link to="/my-bookings" className="nav-link">
                    My Bookings
                  </Link>
                )}

                <button
                  className="btn btn-outline-danger ms-lg-2 mt-2 mt-lg-0"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link">Login</NavLink>
                <Link
                  to="/register"
                  className="btn btn-primary ms-lg-2 mt-2 mt-lg-0"
                >
                  Register
                </Link>
              </>
            )}

            <Link
              to="/accommodations"
              className="btn btn-book ms-lg-2 mt-2 mt-lg-0"
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