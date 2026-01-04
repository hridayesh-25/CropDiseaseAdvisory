import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import DiseaseChecker from '../../components/DiseaseChecker';
import MyDiseases from '../../components/MyDiseases';
import CropAdvisory from '../../components/CropAdvisory';
import WeatherWidget from '../../components/WeatherWidget';
import LandLeasing from '../../components/LandLeasing';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Products fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'products', label: 'Products', icon: '🛍️' },
    { id: 'disease', label: 'Check Disease', icon: '🔬' },
    { id: 'my-diseases', label: 'My Diseases', icon: '📋' },
    { id: 'advisory', label: 'Crop Advisory', icon: '🌾' },
    { id: 'weather', label: 'Weather', icon: '🌤️' },
    { id: 'lands', label: 'Land Leasing', icon: '🏞️' }
  ];

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to Your Dashboard
          </motion.h1>
          <p>Manage your crops and get expert advice</p>
        </div>

        <div className="dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="dashboard-content">
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tab-content"
            >
              <h2>Available Products</h2>
              {loading ? (
                <div className="loading">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <p>No products available yet.</p>
                  <p>Products will appear here once added by admin.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'disease' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tab-content"
            >
              <DiseaseChecker />
            </motion.div>
          )}

          {activeTab === 'my-diseases' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tab-content"
            >
              <MyDiseases />
            </motion.div>
          )}

          {activeTab === 'advisory' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tab-content"
            >
              <CropAdvisory />
            </motion.div>
          )}

          {activeTab === 'weather' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tab-content"
            >
              <WeatherWidget />
            </motion.div>
          )}

          {activeTab === 'lands' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tab-content"
            >
              <LandLeasing />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

