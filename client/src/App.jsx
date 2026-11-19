import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Accommodations from "./pages/Accommodations";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import Contact from "./pages/Contact";

import Dashboard from "./pages/admin/Dashboard";
import Reservations from "./pages/admin/Reservations";
import ManageRooms from "./pages/admin/ManageRooms";
import ManagePayments from "./pages/admin/ManagePayments";
import ManageCustomers from "./pages/admin/ManageCustomers";
import Reports from "./pages/admin/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer website */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Protected admin pages */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="accommodations" element={<ManageRooms />} />
            <Route path="payments" element={<ManagePayments />} />
            <Route path="customers" element={<ManageCustomers />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>

        {/* Not found */}
        <Route
          path="*"
          element={
            <div className="not-found">
              <h1>404</h1>
              <h3>Page Not Found</h3>
              <a href="/" className="btn btn-primary mt-3">
                Back to Home
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;