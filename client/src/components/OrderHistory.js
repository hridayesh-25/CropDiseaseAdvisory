import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-toastify";
import {
  FaBox,
  FaCalendar,
  FaRupeeSign,
  FaTruck,
  FaCheck,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart/orders/list");
      setOrders(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="status-icon pending" />;
      case "confirmed":
        return <FaCheck className="status-icon confirmed" />;
      case "shipped":
        return <FaTruck className="status-icon shipped" />;
      case "delivered":
        return <FaCheck className="status-icon delivered" />;
      case "cancelled":
        return <FaTimesCircle className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "pending";
      case "confirmed":
        return "confirmed";
      case "shipped":
        return "shipped";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      default:
        return "pending";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="order-history-wrapper">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-wrapper">
      <div className="order-history-section">
        <div className="section-header">
          <h2>
            <FaBox className="section-icon" /> Order History
          </h2>
          <p className="section-subtitle">
            Track and manage all your medicine orders
          </p>
        </div>

        {orders.length === 0 ? (
          <motion.div
            className="empty-orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaBox className="empty-icon" />
            <h3>No orders yet</h3>
            <p>Start shopping to place your first order</p>
          </motion.div>
        ) : (
          <div className="orders-list">
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                className="order-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <div className="order-card-header">
                  <div className="order-id-section">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">
                      <FaCalendar /> {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span
                      className={`status-badge ${getStatusColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-card-content">
                  <div className="order-items">
                    <h4>Items:</h4>
                    <div className="items-list">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="item-row">
                            <span className="item-name">
                              {item.medicine?.name || "Medicine"}
                            </span>
                            <span className="item-quantity">
                              Qty: {item.quantity}
                            </span>
                            <span className="item-price">
                              <FaRupeeSign className="rupee-icon" />
                              {item.price}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="no-items">No items in this order</p>
                      )}
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>
                        <FaRupeeSign className="rupee-icon" />
                        {order.subtotal}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Tax:</span>
                      <span>
                        <FaRupeeSign className="rupee-icon" />
                        {order.tax}
                      </span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>
                        <FaRupeeSign className="rupee-icon" />
                        {order.total}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  {order.shippingAddress && (
                    <div className="shipping-info">
                      <p className="shipping-label">Shipping Address:</p>
                      <p className="shipping-address">
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                    </div>
                  )}

                  <button
                    className="details-btn"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDetails(true);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showDetails && selectedOrder && (
        <motion.div
          className="order-details-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Order Details</h2>
              <button
                className="close-btn"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Order Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Order ID:</span>
                    <span className="detail-value">
                      #{selectedOrder._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`detail-value status-badge ${getStatusColor(
                        selectedOrder.status,
                      )}`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment Method:</span>
                    <span className="detail-value">
                      {selectedOrder.paymentMethod
                        ?.replace("-", " ")
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Shipping Address</h3>
                <div className="address-box">
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city},{" "}
                    {selectedOrder.shippingAddress?.state} -
                    {selectedOrder.shippingAddress?.postalCode}
                  </p>
                  <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
                </div>
              </div>

              <div className="detail-section">
                <h3>Items</h3>
                <div className="items-detail-list">
                  {selectedOrder.items &&
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="item-detail-row">
                        <div className="item-info">
                          <p className="item-name">{item.medicine?.name}</p>
                          <p className="item-dosage">
                            Dosage: {item.medicine?.dosage}
                          </p>
                        </div>
                        <div className="item-calc">
                          <p>Qty: {item.quantity}</p>
                          <p className="item-total">
                            <FaRupeeSign className="rupee-icon" />
                            {item.quantity} × {item.price} = ₹
                            {item.quantity * item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Order Summary</h3>
                <div className="summary-detail">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>
                      <FaRupeeSign className="rupee-icon" />
                      {selectedOrder.subtotal}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (5%):</span>
                    <span>
                      <FaRupeeSign className="rupee-icon" />
                      {selectedOrder.tax}
                    </span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount:</span>
                    <span>
                      <FaRupeeSign className="rupee-icon" />
                      {selectedOrder.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderHistory;
