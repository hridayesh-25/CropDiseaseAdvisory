import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import './MyDiseases.css';

const MyDiseases = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      const response = await api.get('/diseases');
      setDiseases(response.data);
    } catch (error) {
      toast.error('Failed to fetch diseases');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="status-icon approved" />;
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  if (loading) {
    return <div className="loading">Loading your diseases...</div>;
  }

  if (diseases.length === 0) {
    return (
      <div className="empty-state">
        <p>You haven't submitted any disease checks yet.</p>
        <p>Go to "Check Disease" tab to submit a new disease check.</p>
      </div>
    );
  }

  return (
    <div className="my-diseases">
      <h2>My Disease Checks</h2>
      <div className="diseases-list">
        {diseases.map((disease) => (
          <motion.div
            key={disease._id}
            className="disease-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="disease-card-header">
              <div>
                <h3>{disease.cropType} - {disease.predictedDisease || disease.diseaseName}</h3>
                <p className="disease-date">
                  Submitted: {new Date(disease.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="disease-status">
                {getStatusIcon(disease.status)}
                <span className={`status-text ${disease.status}`}>
                  {disease.status.charAt(0).toUpperCase() + disease.status.slice(1)}
                </span>
              </div>
            </div>

            {disease.description && (
              <p className="disease-description">{disease.description}</p>
            )}

            {disease.specialistNotes && (
              <div className="specialist-notes">
                <strong>Specialist Notes:</strong>
                <p>{disease.specialistNotes}</p>
              </div>
            )}

            {disease.medicines && disease.medicines.length > 0 && (
              <div className="medicines-section">
                <h4>Recommended Medicines</h4>
                <div className="medicines-grid">
                  {disease.medicines.map((medicine) => (
                    <div key={medicine._id} className="medicine-card">
                      <div className={`price-badge ${medicine.priceCategory}`}>
                        {medicine.priceCategory.toUpperCase()}
                      </div>
                      <h5>{medicine.name}</h5>
                      <p className="medicine-price">₹{medicine.price}</p>
                      <p className="medicine-dosage">Dosage: {medicine.dosage}</p>
                      <p className="medicine-desc">{medicine.description}</p>
                      <div className="medicine-effectiveness">
                        Effectiveness: {medicine.effectiveness}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {disease.status === 'approved' && (!disease.medicines || disease.medicines.length === 0) && (
              <div className="no-medicines">
                <p>No medicines recommended for this disease yet.</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyDiseases;

