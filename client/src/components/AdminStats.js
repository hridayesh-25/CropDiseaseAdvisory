import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaUsers, FaUserShield, FaUserMd, FaProductHunt, FaFlask } from 'react-icons/fa';
import './AdminStats.css';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalSpecialists: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: FaUsers, label: 'Total Users', value: stats.totalUsers, color: '#667eea' },
    { icon: FaUserShield, label: 'Admins', value: stats.totalAdmins, color: '#e74c3c' },
    { icon: FaUserMd, label: 'Specialists', value: stats.totalSpecialists, color: '#2ecc71' },
    { icon: FaUsers, label: 'Total Accounts', value: stats.total, color: '#f39c12' }
  ];

  return (
    <div className="admin-stats">
      <h2>Platform Statistics</h2>
      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{ borderTopColor: stat.color }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon />
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminStats;

