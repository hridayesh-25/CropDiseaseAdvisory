import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaEye, FaPills } from "react-icons/fa";
import "./DiseaseRequests.css";

const DiseaseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [modalType, setModalType] = useState("view"); // 'view' or 'suggest'

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/diseases?status=pending");
      setRequests(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch disease requests");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await api.get("/medicines");
      setMedicines(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch medicines");
      console.error(error);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setModalType("view");
    setShowModal(true);
  };

  const handleSuggestMedicines = (request) => {
    setSelectedRequest(request);
    setModalType("suggest");
    setSelectedMedicines(request.medicines || []);
    fetchMedicines();
    setShowModal(true);
  };

  const handleToggleMedicine = (medicineId) => {
    setSelectedMedicines((prev) =>
      prev.includes(medicineId)
        ? prev.filter((id) => id !== medicineId)
        : [...prev, medicineId],
    );
  };

  const handleSaveMedicines = async () => {
    try {
      await api.put(`/diseases/${selectedRequest._id}`, {
        medicines: selectedMedicines,
      });
      toast.success("Medicines suggested successfully");
      fetchPendingRequests();
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to save medicines");
      console.error(error);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await api.put(`/diseases/${requestId}`, { status: "approved" });
      toast.success("Request approved");
      fetchPendingRequests();
    } catch (error) {
      toast.error("Failed to approve request");
      console.error(error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await api.put(`/diseases/${requestId}`, { status: "rejected" });
      toast.success("Request rejected");
      fetchPendingRequests();
    } catch (error) {
      toast.error("Failed to reject request");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="requests-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h2>Disease Requests</h2>
        <span className="badge">{requests.length} Pending</span>
      </div>

      {requests.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p>No pending disease requests</p>
        </motion.div>
      ) : (
        <div className="requests-grid">
          {requests.map((request, idx) => (
            <motion.div
              key={request._id}
              className="request-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="request-header">
                <h3>{request.predictedDisease}</h3>
                <span className="crop-badge">{request.cropType}</span>
              </div>

              <div className="request-info">
                <p>
                  <strong>Disease:</strong> {request.diseaseName}
                </p>
                <p>
                  <strong>Confidence:</strong>{" "}
                  <span className="confidence">
                    {(request.confidence * 100).toFixed(1)}%
                  </span>
                </p>
                <p>
                  <strong>Farmer:</strong> {request.user?.name || "Unknown"}
                </p>
                <p>
                  <strong>Medicines Suggested:</strong>{" "}
                  <span className="med-count">
                    {(request.medicines || []).length}
                  </span>
                </p>
              </div>

              <div className="request-actions">
                <button
                  className="btn-view"
                  onClick={() => handleViewRequest(request)}
                  title="View details"
                >
                  <FaEye /> View
                </button>
                <button
                  className="btn-suggest"
                  onClick={() => handleSuggestMedicines(request)}
                  title="Suggest medicines"
                >
                  <FaPills /> Suggest
                </button>
                <button
                  className="btn-approve"
                  onClick={() => handleApproveRequest(request._id)}
                  title="Approve request"
                >
                  <FaCheck /> Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleRejectRequest(request._id)}
                  title="Reject request"
                >
                  <FaTimes /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {modalType === "view" && (
                <div className="modal-body">
                  <h2>Disease Request Details</h2>
                  <div className="details">
                    <p>
                      <strong>Disease Name:</strong>{" "}
                      {selectedRequest.diseaseName}
                    </p>
                    <p>
                      <strong>Predicted Disease:</strong>{" "}
                      {selectedRequest.predictedDisease}
                    </p>
                    <p>
                      <strong>Crop Type:</strong> {selectedRequest.cropType}
                    </p>
                    <p>
                      <strong>Confidence:</strong>{" "}
                      {(selectedRequest.confidence * 100).toFixed(1)}%
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {selectedRequest.description}
                    </p>
                    {selectedRequest.image && (
                      <div className="disease-image">
                        <img
                          src={selectedRequest.image}
                          alt={selectedRequest.diseaseName}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {modalType === "suggest" && (
                <div className="modal-body">
                  <h2>
                    Suggest Medicines for {selectedRequest.predictedDisease}
                  </h2>
                  <div className="medicines-list">
                    {medicines.length === 0 ? (
                      <p>No medicines available</p>
                    ) : (
                      medicines.map((medicine) => (
                        <label key={medicine._id} className="medicine-item">
                          <input
                            type="checkbox"
                            checked={selectedMedicines.includes(medicine._id)}
                            onChange={() => handleToggleMedicine(medicine._id)}
                          />
                          <div className="medicine-info">
                            <strong>{medicine.name}</strong>
                            <p>{medicine.description}</p>
                            <span className="dosage">
                              Dosage: {medicine.dosage}
                            </span>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                {modalType === "suggest" && (
                  <button className="btn-save" onClick={handleSaveMedicines}>
                    Save Suggestions
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseRequests;
