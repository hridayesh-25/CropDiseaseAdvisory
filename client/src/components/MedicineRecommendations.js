import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FaLeaf, FaCapsules, FaSearch, FaFilter } from "react-icons/fa";
import "./MedicineRecommendations.css";

const MedicineRecommendations = () => {
  const [diseases, setDiseases] = useState([]);
  const [recommendedMedicines, setRecommendedMedicines] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchApprovedDiseasesWithMedicines();
  }, []);

  const fetchApprovedDiseasesWithMedicines = async () => {
    try {
      setLoading(true);
      const response = await api.get("/diseases");
      const approvedDiseases = response.data.filter(
        (d) => d.status === "approved",
      );
      setDiseases(approvedDiseases);

      // Fetch medicines for each approved disease
      const medicineMap = {};
      for (const disease of approvedDiseases) {
        if (disease.medicines && disease.medicines.length > 0) {
          medicineMap[disease._id] = disease.medicines;
        }
      }
      setRecommendedMedicines(medicineMap);
    } catch (error) {
      toast.error("Failed to fetch disease recommendations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch =
      disease.predictedDisease
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      disease.cropType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "with-meds" && recommendedMedicines[disease._id]) ||
      (filterStatus === "no-meds" && !recommendedMedicines[disease._id]);
    return matchesSearch && matchesStatus;
  });

  const getTotalRecommendations = () => {
    return Object.values(recommendedMedicines).reduce(
      (sum, meds) => sum + (meds.length || 0),
      0,
    );
  };

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <div className="header-content">
          <h2>
            <FaCapsules className="header-icon" /> Medicine Recommendations
          </h2>
          <p className="header-subtitle">
            View and manage medicine recommendations for approved diseases
          </p>
        </div>

        <div className="header-stats">
          <motion.div
            className="stat-card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="stat-label">Approved Diseases</span>
            <span className="stat-value">{diseases.length}</span>
          </motion.div>
          <motion.div
            className="stat-card with-meds"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="stat-label">With Recommendations</span>
            <span className="stat-value">
              {Object.keys(recommendedMedicines).length}
            </span>
          </motion.div>
          <motion.div
            className="stat-card total-meds"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="stat-label">Total Recommendations</span>
            <span className="stat-value">{getTotalRecommendations()}</span>
          </motion.div>
        </div>
      </div>

      <div className="recommendations-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by disease name or crop type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Diseases</option>
            <option value="with-meds">With Recommendations</option>
            <option value="no-meds">No Recommendations</option>
          </select>
        </div>
      </div>

      <div className="recommendations-list">
        {filteredDiseases.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaLeaf className="empty-icon" />
            <h3>No recommendations found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          filteredDiseases.map((disease, idx) => (
            <motion.div
              key={disease._id}
              className="disease-recommendation-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="card-header">
                <div className="disease-info">
                  <h3>{disease.predictedDisease}</h3>
                  <div className="disease-meta">
                    <span className="crop-type">
                      <FaLeaf /> {disease.cropType}
                    </span>
                    <span className="severity">
                      {"🔴".repeat(Math.ceil(disease.severity / 2))}
                    </span>
                  </div>
                </div>
                <div className="medication-count">
                  <span className="count-number">
                    {recommendedMedicines[disease._id]?.length || 0}
                  </span>
                  <span className="count-label">Medicines</span>
                </div>
              </div>

              <div className="card-content">
                {disease.description && (
                  <p className="disease-description">{disease.description}</p>
                )}

                {recommendedMedicines[disease._id] &&
                recommendedMedicines[disease._id].length > 0 ? (
                  <div className="medicines-grid">
                    {recommendedMedicines[disease._id].map(
                      (medicine, medIdx) => (
                        <motion.div
                          key={medicine._id || medIdx}
                          className="medicine-card"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: medIdx * 0.05 }}
                        >
                          <div
                            className={`price-badge ${medicine.priceCategory}`}
                          >
                            {medicine.priceCategory.toUpperCase()}
                          </div>

                          <div className="medicine-header">
                            <h4>{medicine.name}</h4>
                            <span className="effectiveness">
                              ✓ {medicine.effectiveness}% effective
                            </span>
                          </div>

                          <div className="medicine-details">
                            <div className="detail-row">
                              <span className="label">Dosage:</span>
                              <span className="value">{medicine.dosage}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Price:</span>
                              <span className="value price">
                                ₹{medicine.price}
                              </span>
                            </div>
                          </div>

                          {medicine.description && (
                            <p className="medicine-desc">
                              {medicine.description}
                            </p>
                          )}

                          <div className="medicine-footer">
                            <span className="status-badge approved">
                              Approved
                            </span>
                            <span className="recommendation-date">
                              Recommended
                            </span>
                          </div>
                        </motion.div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="no-medicines">
                    <p>No medicines recommended for this disease yet</p>
                    <p className="hint">
                      Select medicines when reviewing this disease
                    </p>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <span className="user-info">
                  👤 Disease submitted by: {disease.user?.name || "User"}
                </span>
                <span className="submitted-date">
                  📅 {new Date(disease.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicineRecommendations;
