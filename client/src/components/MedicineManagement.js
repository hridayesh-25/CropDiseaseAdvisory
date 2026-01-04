import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './MedicineManagement.css';

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    disease: '',
    cropType: '',
    priceCategory: 'low',
    price: '',
    description: '',
    dosage: '',
    effectiveness: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/medicines');
      setMedicines(response.data);
    } catch (error) {
      toast.error('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicine) {
        await api.put(`/medicines/${editingMedicine._id}`, formData);
        toast.success('Medicine updated');
      } else {
        await api.post('/medicines', formData);
        toast.success('Medicine created');
      }
      setShowForm(false);
      setEditingMedicine(null);
      setFormData({
        name: '',
        disease: '',
        cropType: '',
        priceCategory: 'low',
        price: '',
        description: '',
        dosage: '',
        effectiveness: ''
      });
      fetchMedicines();
    } catch (error) {
      toast.error('Failed to save medicine');
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      disease: medicine.disease,
      cropType: medicine.cropType,
      priceCategory: medicine.priceCategory,
      price: medicine.price,
      description: medicine.description,
      dosage: medicine.dosage,
      effectiveness: medicine.effectiveness
    });
    setShowForm(true);
  };

  const handleDelete = async (medicineId) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await api.delete(`/medicines/${medicineId}`);
        toast.success('Medicine deleted');
        fetchMedicines();
      } catch (error) {
        toast.error('Failed to delete medicine');
      }
    }
  };

  return (
    <div className="medicine-management">
      <div className="management-header">
        <h2>Medicine Management</h2>
        <button className="add-btn" onClick={() => {
          setShowForm(true);
          setEditingMedicine(null);
          setFormData({
            name: '',
            disease: '',
            cropType: '',
            priceCategory: 'low',
            price: '',
            description: '',
            dosage: '',
            effectiveness: ''
          });
        }}>
          <FaPlus /> Add Medicine
        </button>
      </div>

      {showForm && (
        <motion.form
          className="medicine-form"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
        >
          <h3>{editingMedicine ? 'Edit' : 'Add'} Medicine</h3>
          <div className="form-grid">
            <div>
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Disease *</label>
              <input
                type="text"
                value={formData.disease}
                onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Crop Type *</label>
              <input
                type="text"
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Price Category *</label>
              <select
                value={formData.priceCategory}
                onChange={(e) => setFormData({ ...formData, priceCategory: e.target.value })}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label>Price *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Effectiveness (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.effectiveness}
                onChange={(e) => setFormData({ ...formData, effectiveness: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              required
            />
          </div>
          <div>
            <label>Dosage *</label>
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="e.g., 2ml per liter of water"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => {
              setShowForm(false);
              setEditingMedicine(null);
            }}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="loading">Loading medicines...</div>
      ) : (
        <div className="medicines-grid">
          {medicines.map((medicine) => (
            <motion.div
              key={medicine._id}
              className="medicine-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={`price-badge ${medicine.priceCategory}`}>
                {medicine.priceCategory.toUpperCase()}
              </div>
              <h3>{medicine.name}</h3>
              <div className="medicine-info">
                <p><strong>Disease:</strong> {medicine.disease}</p>
                <p><strong>Crop:</strong> {medicine.cropType}</p>
                <p><strong>Price:</strong> ₹{medicine.price}</p>
                <p><strong>Dosage:</strong> {medicine.dosage}</p>
                <p><strong>Effectiveness:</strong> {medicine.effectiveness}%</p>
              </div>
              <p className="medicine-description">{medicine.description}</p>
              <div className="medicine-actions">
                <button className="edit-btn" onClick={() => handleEdit(medicine)}>
                  <FaEdit /> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(medicine._id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineManagement;

