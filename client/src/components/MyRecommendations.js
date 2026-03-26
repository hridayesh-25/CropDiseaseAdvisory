import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FaPills, FaLeaf, FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "./MyRecommendations.css";

const MyRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMyRecommendations();
  }, []);

  const fetchMyRecommendations = async () => {
    try {
      setLoading(true);

      // First, try to get specialist-approved diseases with medicines
      const diseaseResponse = await api.get("/diseases?status=approved");
      const approvedDiseases = diseaseResponse.data || [];
      const diseasesWithMedicines = approvedDiseases.filter(
        (d) => d.medicines && d.medicines.length > 0,
      );

      // If user has approved diseases with medicines, show them
      if (diseasesWithMedicines.length > 0) {
        setRecommendations(diseasesWithMedicines);
      } else {
        // Otherwise, fetch all available medicines and display them as general recommendations
        try {
          const medicinesResponse = await api.get("/medicines?status=approved");
          const allMedicines = medicinesResponse.data || [];

          // Create virtual disease objects to show medicines
          const virtualDisease = {
            _id: "general-recommendations",
            diseaseName: "General Recommendations",
            predictedDisease: "Available Medicines",
            description:
              "Here are the recommended medicines available for your crops and diseases",
            medicines: allMedicines,
            status: "approved",
          };

          setRecommendations([virtualDisease]);
        } catch (medicineError) {
          console.error("Failed to fetch medicines:", medicineError);
          setRecommendations([]);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch recommendations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (medicineId, medicineName) => {
    try {
      if (!medicineId) {
        toast.error("Medicine ID is missing");
        console.error("Missing medicineId for medicine:", medicineName);
        return;
      }
      setAddingToCart((prev) => ({ ...prev, [medicineId]: true }));
      console.log("Adding medicine to cart:", medicineId, medicineName);
      const response = await addToCart(medicineId, 1, "medicine");
      console.log("Add to cart response:", response);
      toast.success(`${medicineName} added to cart!`);
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message,
      );
      const errorMsg =
        error.response?.data?.message || "Failed to add medicine to cart";
      toast.error(errorMsg);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [medicineId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="recommendations-wrapper">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-wrapper">
      <div className="recommendations-section">
        <div className="section-header">
          <h2>
            <FaPills className="section-icon" /> My Medicine Recommendations
          </h2>
          <p className="section-subtitle">
            Medicines recommended by specialists for your diseases
          </p>
        </div>

        {recommendations.length === 0 ? (
          <motion.div
            className="empty-recommendations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaLeaf className="empty-icon" />
            <h3>No recommendations yet</h3>
            <p>Specialists will recommend medicines for your disease reports</p>
          </motion.div>
        ) : (
          <div className="recommendations-list">
            {recommendations.map((disease, idx) => (
              <motion.div
                key={disease._id}
                className="recommendation-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="card-header">
                  <div className="disease-title">
                    <h3>{disease.predictedDisease}</h3>
                    <span className="crop-type">{disease.cropType}</span>
                  </div>
                  <div className="confidence-badge">
                    <FaCheckCircle /> {(disease.confidence * 100).toFixed(0)}%
                  </div>
                </div>

                <div className="card-content">
                  <p className="disease-description">{disease.description}</p>

                  {disease.image && (
                    <div className="disease-image">
                      <img src={disease.image} alt={disease.predictedDisease} />
                    </div>
                  )}

                  <div className="medicines-section">
                    <h4>Recommended Medicines:</h4>
                    <div className="medicines-grid">
                      {disease.medicines.map((medicine, medIdx) => (
                        <motion.div
                          key={medicine._id}
                          className="medicine-badge"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 + medIdx * 0.05 }}
                        >
                          <div className="badge-header">
                            <strong>{medicine.name}</strong>
                            {medicine.sideEffects && (
                              <span
                                className="warning"
                                title={medicine.sideEffects}
                              >
                                ⚠️
                              </span>
                            )}
                          </div>
                          <p className="dosage">
                            <strong>Dosage:</strong> {medicine.dosage}
                          </p>
                          {medicine.description && (
                            <p className="description">
                              {medicine.description}
                            </p>
                          )}
                          {medicine.price && (
                            <p className="price">
                              <strong>₹{medicine.price}</strong>
                            </p>
                          )}
                          <button
                            className="add-to-cart-btn"
                            onClick={() =>
                              handleAddToCart(medicine._id, medicine.name)
                            }
                            disabled={addingToCart[medicine._id]}
                          >
                            {addingToCart[medicine._id] ? (
                              "Adding..."
                            ) : (
                              <>
                                <FaShoppingCart /> Add to Cart
                              </>
                            )}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {disease.specialistNotes && (
                    <div className="specialist-notes">
                      <h4>Specialist Notes:</h4>
                      <p>{disease.specialistNotes}</p>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <span className="status approved">
                    <FaCheckCircle /> Approved
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecommendations;
