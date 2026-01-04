import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLeaf, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/dashboard/admin';
    if (user?.role === 'specialist') return '/dashboard/specialist';
    return '/dashboard/user';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={getDashboardPath()} className="navbar-brand">
          <FaLeaf className="brand-icon" />
          <span>Crop Advisory</span>
        </Link>

        <div className="navbar-menu">
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

