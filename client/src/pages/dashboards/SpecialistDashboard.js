import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import DiseaseReview from '../../components/DiseaseReview';
import MedicineApproval from '../../components/MedicineApproval';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const SpecialistDashboard = () => {
  const [activeTab, setActiveTab] = useState('diseases');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      const response = await api.get('/diseases');
      const pending = response.data.filter(d => d.status === 'pending').length;
      setPendingCount(pending);
    } catch (error) {
      console.error('Failed to fetch pending count');
    }
  };

  const tabs = [
    { id: 'diseases', label: 'Disease Reviews', icon: '🔬', badge: pendingCount },
    { id: 'medicines', label: 'Medicine Approval', icon: '💊' }
  ];

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Specialist Dashboard
          </motion.h1>
          <p>Review diseases and approve medicines</p>
        </div>

        <div className="dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
              {tab.badge > 0 && (
                <span className="tab-badge">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        <div className="dashboard-content">
          {activeTab === 'diseases' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tab-content"
            >
              <DiseaseReview onReview={fetchPendingCount} />
            </motion.div>
          )}

          {activeTab === 'medicines' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tab-content"
            >
              <MedicineApproval />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard;

