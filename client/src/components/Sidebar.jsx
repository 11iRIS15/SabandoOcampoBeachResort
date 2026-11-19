import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  House,
  CreditCard,
  Users,
  ChartNoAxesCombined,
  LogOut,
  Waves,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <img src="/images/logo.png" alt="Resort logo" />
        <div>
          <strong>Sabando Ocampo</strong>
          <small>Administration</small>
        </div>
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin" end>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/admin/reservations">
          <CalendarDays size={18} /> Reservations
        </NavLink>

        <NavLink to="/admin/accommodations">
          <House size={18} /> Accommodations
        </NavLink>

        <NavLink to="/admin/payments">
          <CreditCard size={18} /> Payments
        </NavLink>

        <NavLink to="/admin/customers">
          <Users size={18} /> Customers
        </NavLink>

        <NavLink to="/admin/reports">
          <ChartNoAxesCombined size={18} /> Reports
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-resort-label">
          <Waves size={17} /> Beach Resort Management
        </div>

        <button onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;