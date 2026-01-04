import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-placeholder">🌾</div>
        )}
        <div className="product-category">{product.category}</div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div className="product-rating">
            <FaStar className="star-icon" />
            <span>{product.rating || 0}</span>
          </div>
          <div className="product-price">₹{product.price}</div>
        </div>
        <button className="product-button">
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;

