import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import './DiseaseReview.css';

const DiseaseReview = ({ onReview }) => {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    status: 'reviewed',
    specialistNotes: '',
    medicines: []
  });

  useEffect(() => {
    fetchDiseases();
  }, []);

  useEffect(() => {
    if (selectedDisease) {
      fetchAvailableMedicines();
    }
  }, [selectedDisease]);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const response = await api.get('/diseases');
      console.log('Fetched diseases:', response.data);
      setDiseases(response.data || []);
    } catch (error) {
      console.error('Error fetching diseases:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch diseases');
      setDiseases([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMedicines = async () => {
    if (!selectedDisease) return;
    
    try {
      const response = await api.get('/medicines', {
        params: {
          disease: selectedDisease.predictedDisease || selectedDisease.diseaseName,
          cropType: selectedDisease.cropType,
          status: 'approved'
        }
      });
      setAvailableMedicines(response.data);
      
      // Pre-select medicines if none selected
      if (reviewData.medicines.length === 0 && response.data.length > 0) {
        // Select one medicine from each price category
        const low = response.data.find(m => m.priceCategory === 'low');
        const medium = response.data.find(m => m.priceCategory === 'medium');
        const high = response.data.find(m => m.priceCategory === 'high');
        const selected = [low, medium, high].filter(Boolean).map(m => m._id);
        setReviewData({ ...reviewData, medicines: selected });
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
    }
  };

  const handleReview = async (diseaseId, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/diseases/${diseaseId}/approve`, {
          ...reviewData,
          status: 'approved',
          medicines: reviewData.medicines
        });
        toast.success('Disease approved successfully with medicines');
      } else {
        await api.put(`/diseases/${diseaseId}/review`, {
          ...reviewData,
          status: action === 'reject' ? 'rejected' : 'reviewed'
        });
        toast.success('Review submitted');
      }
      fetchDiseases();
      if (onReview) onReview();
      setSelectedDisease(null);
      setReviewData({ status: 'reviewed', specialistNotes: '', medicines: [] });
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const toggleMedicine = (medicineId) => {
    const currentMedicines = reviewData.medicines || [];
    if (currentMedicines.includes(medicineId)) {
      setReviewData({
        ...reviewData,
        medicines: currentMedicines.filter(id => id !== medicineId)
      });
    } else {
      setReviewData({
        ...reviewData,
        medicines: [...currentMedicines, medicineId]
      });
    }
  };

  const pendingDiseases = diseases.filter(d => d.status === 'pending');
  const reviewedDiseases = diseases.filter(d => d.status !== 'pending');

  return (
    <div className="disease-review">
      <div className="review-header">
        <h2>Disease Reviews</h2>
        <div className="stats">
          <span className="stat-item pending">{pendingDiseases.length} Pending</span>
          <span className="stat-item reviewed">{reviewedDiseases.length} Reviewed</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading diseases...</div>
      ) : (
        <div className="diseases-list">
          {diseases.length === 0 ? (
            <div className="empty-state">
              <p>No diseases found.</p>
              <p>Diseases submitted by users will appear here for review.</p>
            </div>
          ) : pendingDiseases.length === 0 ? (
            <div className="empty-state">
              <p>No pending diseases to review.</p>
              <p>All diseases have been reviewed. Total: {diseases.length} diseases</p>
            </div>
          ) : (
            pendingDiseases.map((disease) => (
              <motion.div
                key={disease._id}
                className="disease-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="disease-info">
                  <h3>{disease.cropType} - {disease.predictedDisease || disease.diseaseName}</h3>
                  <p className="disease-meta">
                    Submitted by: {disease.user?.name || 'Unknown'} | 
                    Confidence: {(disease.confidence * 100).toFixed(1)}%
                  </p>
                  {disease.description && (
                    <p className="disease-description">{disease.description}</p>
                  )}
                </div>
                <div className="disease-actions">
                  <button
                    className="view-btn"
                    onClick={() => setSelectedDisease(disease)}
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {selectedDisease && (
        <motion.div
          className="review-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedDisease(null)}
        >
          <motion.div
            className="review-modal-content"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Review Disease</h3>
              <button onClick={() => setSelectedDisease(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="disease-details">
                <div className="detail-row">
                  <strong>Crop Type:</strong> {selectedDisease.cropType}
                </div>
                <div className="detail-row">
                  <strong>Disease:</strong> {selectedDisease.predictedDisease || selectedDisease.diseaseName}
                </div>
                <div className="detail-row">
                  <strong>Confidence:</strong> {(selectedDisease.confidence * 100).toFixed(1)}%
                </div>
                {selectedDisease.image && (
                  <div className="disease-image">
                    <img src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${selectedDisease.image}`} alt="Disease" />
                  </div>
                )}
                {selectedDisease.description && (
                  <div className="detail-row">
                    <strong>Description:</strong>
                    <p>{selectedDisease.description}</p>
                  </div>
                )}
              </div>
              <div className="review-form">
                <label>
                  Specialist Notes
                  <textarea
                    value={reviewData.specialistNotes}
                    onChange={(e) => setReviewData({ ...reviewData, specialistNotes: e.target.value })}
                    rows="4"
                    placeholder="Add your review notes..."
                  />
                </label>
                
                {availableMedicines.length > 0 && (
                  <div className="medicines-selection">
                    <label>
                      <strong>Select Recommended Medicines:</strong>
                      <div className="medicines-grid">
                        {availableMedicines.map((medicine) => (
                          <div
                            key={medicine._id}
                            className={`medicine-option ${
                              reviewData.medicines?.includes(medicine._id) ? 'selected' : ''
                            }`}
                            onClick={() => toggleMedicine(medicine._id)}
                          >
                            <input
                              type="checkbox"
                              checked={reviewData.medicines?.includes(medicine._id)}
                              onChange={() => toggleMedicine(medicine._id)}
                            />
                            <div className="medicine-option-content">
                              <div className="medicine-option-header">
                                <span className="medicine-name">{medicine.name}</span>
                                <span className={`price-badge ${medicine.priceCategory}`}>
                                  {medicine.priceCategory.toUpperCase()}
                                </span>
                              </div>
                              <div className="medicine-option-details">
                                <span>₹{medicine.price}</span>
                                <span>•</span>
                                <span>{medicine.effectiveness}% effective</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {reviewData.medicines?.length === 0 && (
                        <p className="medicine-hint">
                          💡 No medicines selected. System will auto-select medicines when approved.
                        </p>
                      )}
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="reject-btn"
                onClick={() => handleReview(selectedDisease._id, 'reject')}
              >
                <FaTimes /> Reject
              </button>
              <button
                className="approve-btn"
                onClick={() => handleReview(selectedDisease._id, 'approve')}
              >
                <FaCheck /> Approve {reviewData.medicines?.length > 0 && `(${reviewData.medicines.length} medicines)`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DiseaseReview;

