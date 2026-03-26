import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCheck } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, loading } = useCart();
  const [updatingItems, setUpdatingItems] = useState({});

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems({ ...updatingItems, [itemId]: true });
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItems({ ...updatingItems, [itemId]: false });
    }
  };

  if (loading) {
    return (
      <div className="cart-container loading-state">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;
  const itemCount = isEmpty
    ? 0
    : cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = cart?.subtotal || 0;
  const tax = cart?.tax || 0;
  const total = cart?.total || 0;

  return (
    <div className="cart-wrapper">
      <nav className="cart-navbar">
        <button className="nav-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h1>Shopping Cart</h1>
        <div className="nav-spacer"></div>
      </nav>

      <div className="cart-container">
        {isEmpty ? (
          <motion.div
            className="empty-cart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Start adding medicines and products to get started!</p>
            <Link to="/dashboard/user" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="cart-content">
            <motion.div
              className="cart-items-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="section-header">
                <h2>Cart Items ({itemCount})</h2>
                <span className="item-count-badge">
                  {cart.items.length} items
                </span>
              </div>

              <div className="cart-items">
                {cart.items.map((item, idx) => {
                  const itemData =
                    item.itemData || item.itemId || item.medicine;
                  const itemId =
                    typeof item.itemId === "string"
                      ? item.itemId
                      : item.itemId?._id || item.medicine?._id;
                  const isMedicine = item.itemType === "medicine";

                  return (
                    <motion.div
                      key={itemId || idx}
                      className="cart-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="item-visual">
                        <div className="item-icon">
                          {isMedicine ? "💊" : "🌾"}
                        </div>
                        {isMedicine && itemData?.priceCategory && (
                          <span
                            className={`price-badge ${itemData.priceCategory}`}
                          >
                            {itemData.priceCategory.toUpperCase()}
                          </span>
                        )}
                        {!isMedicine && itemData?.category && (
                          <span className={`price-badge ${itemData.category}`}>
                            {itemData.category.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="item-details">
                        <h4>{itemData?.name || "Item"}</h4>
                        {isMedicine ? (
                          <>
                            <p className="item-disease">
                              {itemData?.disease} • {itemData?.cropType}
                            </p>
                            <div className="item-meta">
                              <span className="dosage-info">
                                <strong>Dosage:</strong>{" "}
                                {itemData?.dosage || "N/A"}
                              </span>
                              <span className="effectiveness-info">
                                ✓ {itemData?.effectiveness || 0}% effective
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="item-disease">{itemData?.category}</p>
                        )}
                        <p className="item-description">
                          {itemData?.description}
                        </p>
                      </div>

                      <div className="item-controls">
                        <div className="quantity-control">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleQuantityChange(itemId, item.quantity - 1)
                            }
                            disabled={
                              updatingItems[itemId] || item.quantity <= 1
                            }
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="999"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                itemId,
                                parseInt(e.target.value) || 1,
                              )
                            }
                            disabled={updatingItems[itemId]}
                            className="qty-input"
                          />
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleQuantityChange(itemId, item.quantity + 1)
                            }
                            disabled={updatingItems[itemId]}
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <div className="item-price-section">
                          <p className="unit-price">
                            ₹{item.price?.toFixed(2) || "0.00"}
                          </p>
                          <p className="total-price">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => handleRemove(itemId)}
                          title="Remove from cart"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="cart-summary-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="summary-card">
                <h3>Order Summary</h3>

                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="amount">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-row tax-row">
                    <span>Tax (18% GST)</span>
                    <span className="amount">₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total-row">
                    <span>Total Amount</span>
                    <span className="amount-total">₹{total.toFixed(2)}</span>
                  </div>

                  <div className="savings-banner">
                    <span>✓ Free shipping on orders above ₹500</span>
                  </div>
                </div>

                <button
                  className="checkout-btn"
                  onClick={() => navigate("/checkout")}
                >
                  <FaCheck /> Proceed to Checkout
                </button>

                <Link to="/dashboard/user" className="continue-shopping">
                  <FaArrowLeft /> Continue Shopping
                </Link>
              </div>

              <div className="trust-indicators">
                <div className="trust-item">
                  <span className="icon">🔒</span>
                  <p>Secure Payment</p>
                </div>
                <div className="trust-item">
                  <span className="icon">🚚</span>
                  <p>Fast Delivery</p>
                </div>
                <div className="trust-item">
                  <span className="icon">↩️</span>
                  <p>Easy Returns</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
