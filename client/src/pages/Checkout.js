import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, checkout } = useCart();
  const diseaseId = location.state?.diseaseId || null;

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="checkout-container">
          <div className="empty-checkout">
            <FaShoppingCart className="empty-icon" />
            <h3>Your cart is empty</h3>
            <p>Please add items to your cart before checking out</p>
            <button
              className="back-btn"
              onClick={() => navigate("/dashboard/user")}
            >
              Back to Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateAddress = () => {
    if (
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode ||
      !formData.phone
    ) {
      toast.error("Please fill in all address fields");
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateAddress()) return;

    setLoading(true);
    try {
      const result = await checkout(
        {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        paymentMethod,
        diseaseId,
      );

      if (result.success || result.order) {
        toast.success("Order placed successfully!");
        setStep(3);
        setTimeout(() => {
          navigate("/dashboard/user");
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="progress-bar">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <span>1</span>
              <label>Address</label>
            </div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <span>2</span>
              <label>Payment</label>
            </div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>
              <span>3</span>
              <label>Confirmation</label>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {step === 1 && (
              <motion.form
                className="checkout-form address-form"
                onSubmit={handleAddressSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2>
                  <FaMapMarkerAlt /> Delivery Address
                </h2>

                <div className="form-group full">
                  <label>Full Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Enter postal code"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      disabled
                    />
                  </div>
                </div>

                <div className="form-group full">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter contact number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Continue to Payment →
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                className="checkout-form payment-form"
                onSubmit={handleCheckout}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2>
                  <FaCreditCard /> Payment Method
                </h2>

                <div className="payment-options">
                  {[
                    {
                      value: "cod",
                      label: "Cash on Delivery",
                      description: "Pay when you receive your order",
                    },
                    {
                      value: "upi",
                      label: "UPI",
                      description: "Pay using UPI/Google Pay/PhonePe",
                    },
                    {
                      value: "credit-card",
                      label: "Credit Card",
                      description: "Pay using credit card",
                    },
                    {
                      value: "debit-card",
                      label: "Debit Card",
                      description: "Pay using debit card",
                    },
                    {
                      value: "net-banking",
                      label: "Net Banking",
                      description: "Pay using net banking",
                    },
                  ].map((option) => (
                    <label key={option.value} className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="option-content">
                        <span className="option-label">{option.label}</span>
                        <span className="option-desc">
                          {option.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => setStep(1)}
                  >
                    ← Back to Address
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Place Order →"}
                  </button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.div
                className="confirmation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="confirmation-icon">
                  <FaCheckCircle />
                </div>
                <h2>Order Confirmed!</h2>
                <p>
                  Thank you for your order. You will receive a confirmation
                  email shortly.
                </p>
                <div className="order-number">Order ID: #ORD-{Date.now()}</div>
                <div className="confirmation-details">
                  <p>
                    <strong>Delivery City:</strong> {formData.city},{" "}
                    {formData.state}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹
                    {cart.total?.toFixed(2) || "0.00"}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {paymentMethod.toUpperCase().replace("-", " ")}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span style={{ color: "#2ecc71", fontWeight: 700 }}>
                      Pending
                    </span>
                  </p>
                </div>
                <p style={{ color: "#667eea", fontWeight: 600, marginTop: 20 }}>
                  Redirecting to dashboard...
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
