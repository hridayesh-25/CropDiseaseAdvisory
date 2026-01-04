import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './MedicineApproval.css';

const MedicineApproval = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchMedicines();
  }, [filter]);

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/medicines', {
        params: { status: filter || undefined }
      });
      setMedicines(response.data);
    } catch (error) {
      toast.error('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (medicineId) => {
    try {
      await api.put(`/medicines/${medicineId}/approve`);
      toast.success('Medicine approved');
      fetchMedicines();
    } catch (error) {
      toast.error('Failed to approve medicine');
    }
  };

  const handleReject = async (medicineId) => {
    if (window.confirm('Are you sure you want to reject this medicine?')) {
      try {
        await api.put(`/medicines/${medicineId}`, { status: 'rejected' });
        toast.success('Medicine rejected');
        fetchMedicines();
      } catch (error) {
        toast.error('Failed to reject medicine');
      }
    }
  };

  return (
    <div className="medicine-approval">
      <div className="approval-header">
        <h2>Medicine Approval</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading medicines...</div>
      ) : (
        <div className="medicines-list">
          {medicines.length === 0 ? (
            <div className="empty-state">No medicines found</div>
          ) : (
            medicines.map((medicine) => (
              <motion.div
                key={medicine._id}
                className="medicine-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`price-badge ${medicine.priceCategory}`}>
                  {medicine.priceCategory.toUpperCase()}
                </div>
                <h3>{medicine.name}</h3>
                <div className="medicine-info">
                  <p><strong>Disease:</strong> {medicine.disease}</p>
                  <p><strong>Crop Type:</strong> {medicine.cropType}</p>
                  <p><strong>Price:</strong> ₹{medicine.price}</p>
                  <p><strong>Dosage:</strong> {medicine.dosage}</p>
                  <p><strong>Effectiveness:</strong> {medicine.effectiveness}%</p>
                </div>
                <p className="medicine-description">{medicine.description}</p>
                <div className="medicine-status">
                  Status: <span className={`status-badge ${medicine.status}`}>
                    {medicine.status}
                  </span>
                </div>
                {medicine.status === 'pending' && (
                  <div className="medicine-actions">
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(medicine._id)}
                    >
                      <FaTimes /> Reject
                    </button>
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(medicine._id)}
                    >
                      <FaCheck /> Approve
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MedicineApproval;

