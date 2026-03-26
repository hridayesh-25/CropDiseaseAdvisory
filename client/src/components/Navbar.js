import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaLeaf, FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, getCartItemCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartItemCount();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/dashboard/admin";
    if (user?.role === "specialist") return "/dashboard/specialist";
    return "/dashboard/user";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={getDashboardPath()} className="navbar-brand">
          <FaLeaf className="brand-icon" />
          <span>Crop Advisory</span>
        </Link>

        <div className="navbar-menu">
          {user?.role === "user" && (
            <Link to="/cart" className="cart-link">
              <FaShoppingCart className="cart-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
          <div className="navbar-user">
            <FaUser className="user-icon" />
            <span>{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
