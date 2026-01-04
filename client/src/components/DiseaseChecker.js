import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaUpload, FaSearch, FaLeaf } from 'react-icons/fa';
import './DiseaseChecker.css';

const DiseaseChecker = () => {
  const [method, setMethod] = useState('image'); // 'image' or 'text'
  const [cropType, setCropType] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cropType) {
      toast.error('Please select crop type');
      return;
    }

    if (method === 'image' && !image) {
      toast.error('Please upload an image');
      return;
    }

    if (method === 'text' && !diseaseName) {
      toast.error('Please enter disease name');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('cropType', cropType);
      formData.append('diseaseName', diseaseName);
      formData.append('description', description);
      
      if (image) {
        formData.append('image', image);
      }

      const response = await api.post('/diseases/check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
      toast.success('Disease submitted for specialist review');
      
      // Reset form
      setImage(null);
      setImagePreview(null);
      setDiseaseName('');
      setDescription('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check disease');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disease-checker">
      <h2>Check Disease & Get Medicine</h2>
      <p className="subtitle">Upload an image or enter disease name to get recommendations</p>

      <div className="method-selector">
        <button
          className={`method-btn ${method === 'image' ? 'active' : ''}`}
          onClick={() => setMethod('image')}
        >
          <FaUpload /> Upload Image
        </button>
        <button
          className={`method-btn ${method === 'text' ? 'active' : ''}`}
          onClick={() => setMethod('text')}
        >
          <FaSearch /> Enter Disease Name
        </button>
      </div>

      <form onSubmit={handleSubmit} className="disease-form">
        <div className="form-row">
          <label>
            Crop Type *
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              required
            >
              <option value="">Select Crop Type</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Maize">Maize</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        {method === 'image' && (
          <div className="form-row">
            <label>
              Upload Leaf Image *
              <div className="image-upload">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="remove-image"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="upload-area">
                    <FaUpload className="upload-icon" />
                    <span>Click to upload or drag and drop</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </label>
                )}
              </div>
            </label>
          </div>
        )}

        {method === 'text' && (
          <div className="form-row">
            <label>
              Disease Name *
              <input
                type="text"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                placeholder="e.g., Leaf Spot, Rust, Blight"
                required
              />
            </label>
          </div>
        )}

        <div className="form-row">
          <label>
            Additional Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe symptoms, affected area, etc."
              rows="4"
            />
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Check Disease'}
        </button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="result-card"
        >
          <h3>Analysis Result</h3>
          <div className="result-info">
            <p><strong>Predicted Disease:</strong> {result.disease.predictedDisease}</p>
            <p><strong>Confidence:</strong> {(result.disease.confidence * 100).toFixed(1)}%</p>
            <p><strong>Status:</strong> {result.disease.status}</p>
          </div>
          
          {result.medicines && result.medicines.length > 0 ? (
            <div className="medicines-section">
              <h4>Recommended Medicines</h4>
              <div className="medicines-grid">
                {result.medicines.map((medicine, idx) => (
                  <div key={idx} className="medicine-card">
                    <div className={`price-badge ${medicine.priceCategory}`}>
                      {medicine.priceCategory.toUpperCase()}
                    </div>
                    <h5>{medicine.name}</h5>
                    <p className="medicine-price">₹{medicine.price}</p>
                    <p className="medicine-desc">{medicine.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="pending-message">
              <FaLeaf />
              <p>Your request is pending specialist review. Medicines will be recommended after approval.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default DiseaseChecker;

