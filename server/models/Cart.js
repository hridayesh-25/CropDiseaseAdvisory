const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  itemType: {
    type: String,
    enum: ["medicine", "product"],
    default: "medicine",
  },
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate totals before saving
cartSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  this.tax = Math.round(this.subtotal * 0.18); // 18% GST
  this.total = this.subtotal + this.tax;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
