import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaRuler, FaRupeeSign, FaPhone } from 'react-icons/fa';
import './LandLeasing.css';

const LandLeasing = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', state: '', status: 'available' });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    area: '',
    areaUnit: 'acres',
    price: '',
    priceUnit: 'per-acre',
    suitableCrops: '',
    soilType: '',
    waterSource: 'rain'
  });

  useEffect(() => {
    fetchLands();
  }, [filters]);

  const fetchLands = async () => {
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.state) params.state = filters.state;
      if (filters.status) params.status = filters.status;

      const response = await api.get('/lands', { params });
      setLands(response.data);
    } catch (error) {
      toast.error('Failed to fetch lands');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lands', formData);
      toast.success('Land listed successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        address: '',
        city: '',
        state: '',
        area: '',
        areaUnit: 'acres',
        price: '',
        priceUnit: 'per-acre',
        suitableCrops: '',
        soilType: '',
        waterSource: 'rain'
      });
      fetchLands();
    } catch (error) {
      toast.error('Failed to list land');
    }
  };

  const handleLease = async (landId) => {
    if (window.confirm('Are you sure you want to lease this land?')) {
      try {
        await api.put(`/lands/${landId}/lease`, {
          leaseStartDate: new Date(),
          leaseEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        });
        toast.success('Land leased successfully!');
        fetchLands();
      } catch (error) {
        toast.error('Failed to lease land');
      }
    }
  };

  return (
    <div className="land-leasing">
      <div className="land-header">
        <h2>Crop Land Leasing</h2>
        <button className="add-land-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ List Your Land'}
        </button>
      </div>

      {showForm && (
        <motion.form
          className="land-form"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
        >
          <h3>List Your Land</h3>
          <div className="form-grid">
            <div>
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label>City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <label>State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Area *</label>
              <div className="input-group">
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                />
                <select
                  value={formData.areaUnit}
                  onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="square-feet">Square Feet</option>
                </select>
              </div>
            </div>
            <div>
              <label>Price *</label>
              <div className="input-group">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
                <select
                  value={formData.priceUnit}
                  onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                >
                  <option value="per-acre">Per Acre</option>
                  <option value="per-hectare">Per Hectare</option>
                  <option value="per-month">Per Month</option>
                  <option value="per-year">Per Year</option>
                </select>
              </div>
            </div>
            <div>
              <label>Suitable Crops</label>
              <input
                type="text"
                value={formData.suitableCrops}
                onChange={(e) => setFormData({ ...formData, suitableCrops: e.target.value })}
                placeholder="e.g., Rice, Wheat, Maize"
              />
            </div>
            <div>
              <label>Soil Type</label>
              <input
                type="text"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              />
            </div>
            <div>
              <label>Water Source</label>
              <select
                value={formData.waterSource}
                onChange={(e) => setFormData({ ...formData, waterSource: e.target.value })}
              >
                <option value="well">Well</option>
                <option value="river">River</option>
                <option value="canal">Canal</option>
                <option value="rain">Rain</option>
                <option value="irrigation">Irrigation</option>
              </select>
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
          <button type="submit" className="submit-btn">List Land</button>
        </motion.form>
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by city"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by state"
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="available">Available</option>
          <option value="leased">Leased</option>
          <option value="">All</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading lands...</div>
      ) : (
        <div className="lands-grid">
          {lands.map((land) => (
            <motion.div
              key={land._id}
              className="land-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="land-status">{land.status}</div>
              <h3>{land.title}</h3>
              <p className="land-description">{land.description}</p>
              <div className="land-details">
                <div className="land-detail-item">
                  <FaMapMarkerAlt /> {land.location.city}, {land.location.state}
                </div>
                <div className="land-detail-item">
                  <FaRuler /> {land.area.value} {land.area.unit}
                </div>
                <div className="land-detail-item">
                  <FaRupeeSign /> {land.price} / {land.priceUnit}
                </div>
              </div>
              {land.suitableCrops && land.suitableCrops.length > 0 && (
                <div className="suitable-crops">
                  <strong>Suitable Crops:</strong>
                  <div className="crops-tags">
                    {land.suitableCrops.map((crop, idx) => (
                      <span key={idx}>{crop}</span>
                    ))}
                  </div>
                </div>
              )}
              {land.status === 'available' && (
                <button
                  className="lease-btn"
                  onClick={() => handleLease(land._id)}
                >
                  Lease This Land
                </button>
              )}
              {land.owner && (
                <div className="land-owner">
                  <FaPhone /> {land.owner.phone || 'Contact owner'}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandLeasing;

