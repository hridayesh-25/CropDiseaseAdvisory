import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaCalendarAlt, FaSeedling } from 'react-icons/fa';
import './CropAdvisory.css';

const CropAdvisory = () => {
  const [location, setLocation] = useState('');
  const [season, setSeason] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [locationCrops, setLocationCrops] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLocationSearch = async () => {
    if (!location) {
      toast.error('Please enter a location');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/crops/by-location', {
        params: { city: location, state: location }
      });
      setLocationCrops(response.data);
    } catch (error) {
      toast.error('Failed to fetch location-based recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSeasonSearch = async () => {
    setLoading(true);
    try {
      const response = await api.get('/crops/recommendations', {
        params: { location, season: season || undefined }
      });
      setRecommendations(response.data);
    } catch (error) {
      toast.error('Failed to fetch season-based recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-advisory">
      <h2>Crop Advisory</h2>
      <p className="subtitle">Get recommendations for the best crops based on location and season</p>

      <div className="advisory-sections">
        <motion.div
          className="advisory-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="card-header">
            <FaMapMarkerAlt className="card-icon" />
            <h3>Best Crops by Location</h3>
          </div>
          <div className="card-content">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter city or state"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button onClick={handleLocationSearch} disabled={loading}>
                Search
              </button>
            </div>
            {locationCrops && (
              <div className="results">
                <h4>Recommended Crops for {locationCrops.location}</h4>
                <div className="crops-list">
                  {locationCrops.bestCrops.map((crop, idx) => (
                    <span key={idx} className="crop-tag">
                      {crop}
                    </span>
                  ))}
                </div>
                <div className="crop-info">
                  <p><strong>Soil Type:</strong> {locationCrops.soilType}</p>
                  <p><strong>Water Requirement:</strong> {locationCrops.waterRequirement}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="advisory-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="card-header">
            <FaCalendarAlt className="card-icon" />
            <h3>Best Crops by Season</h3>
          </div>
          <div className="card-content">
            <div className="input-group">
              <select value={season} onChange={(e) => setSeason(e.target.value)}>
                <option value="">Select Season</option>
                <option value="summer">Summer</option>
                <option value="winter">Winter</option>
                <option value="monsoon">Monsoon</option>
                <option value="spring">Spring</option>
              </select>
              <button onClick={handleSeasonSearch} disabled={loading}>
                Get Recommendations
              </button>
            </div>
            {recommendations && (
              <div className="results">
                <h4>Recommended Crops for {recommendations.season}</h4>
                <p className="climate-info">
                  Climate Zone: <strong>{recommendations.climateZone}</strong>
                </p>
                <div className="crops-list">
                  {recommendations.recommendedCrops.map((crop, idx) => (
                    <span key={idx} className="crop-tag">
                      <FaSeedling /> {crop}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CropAdvisory;

