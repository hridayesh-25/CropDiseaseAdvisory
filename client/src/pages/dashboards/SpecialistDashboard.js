import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import DiseaseReview from "../../components/DiseaseReview";
import MedicineApproval from "../../components/MedicineApproval";
import MedicineRecommendations from "../../components/MedicineRecommendations";
import api from "../../utils/api";
import "./Dashboard.css";

const SpecialistDashboard = () => {
  const [activeTab, setActiveTab] = useState("recommendations");
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      const diseasesResponse = await api.get("/diseases");
      const pending = diseasesResponse.data.filter(
        (d) => d.status === "pending",
      ).length;
      const approved = diseasesResponse.data.filter(
        (d) => d.status === "approved",
      ).length;
      const rejected = diseasesResponse.data.filter(
        (d) => d.status === "rejected",
      ).length;
      setStats({ pending, approved, rejected });
    } catch (error) {
      console.error("Failed to fetch pending count");
    }
  };

  const tabs = [
    { id: "recommendations", label: "Medicine Recommendations", icon: "💊" },
    {
      id: "diseases",
      label: "Disease Reviews",
      icon: "🔬",
      badge: stats.pending,
    },
    { id: "medicines", label: "Medicine Approval", icon: "✓" },
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
          <p>Manage disease reviews, medicine approvals, and recommendations</p>
        </div>

        <div className="dashboard-stats">
          <motion.div
            className="stat-box"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="stat-label">Pending Reviews</span>
            <span className="stat-number pending">{stats.pending}</span>
          </motion.div>
          <motion.div
            className="stat-box"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="stat-label">Approved Diseases</span>
            <span className="stat-number approved">{stats.approved}</span>
          </motion.div>
          <motion.div
            className="stat-box"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="stat-label">Rejected</span>
            <span className="stat-number rejected">{stats.rejected}</span>
          </motion.div>
        </div>

        <div className="dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
              {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
            </button>
          ))}
        </div>

        <div className="dashboard-content">
          {activeTab === "recommendations" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tab-content"
            >
              <MedicineRecommendations />
            </motion.div>
          )}

          {activeTab === "diseases" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tab-content"
            >
              <DiseaseReview onReview={fetchPendingCount} />
            </motion.div>
          )}

          {activeTab === "medicines" && (
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
