const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  shippingAddress: {
    city: String,
    state: String,
    country: String,
    postalCode: String,
    address: String,
    phone: String,
  },
  paymentMethod: {
    type: String,
    enum: ["upi", "credit-card", "debit-card", "net-banking", "cod"],
    default: "cod",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  disease: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Disease",
  },
  trackingNumber: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
