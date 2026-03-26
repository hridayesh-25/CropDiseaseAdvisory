const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Medicine = require("../models/Medicine");
const Product = require("../models/Product");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Helper function to transform cart response
const transformCart = (cart) => {
  const cartObj = cart.toObject ? cart.toObject() : cart;
  if (cartObj.items && Array.isArray(cartObj.items)) {
    cartObj.items = cartObj.items.map((item) => {
      // Get the populated reference or fall back to original itemId
      const populatedRef =
        item.itemType === "medicine" ? item.medicineId : item.productId;
      const itemId = populatedRef?._id || item.itemId;
      const itemData = populatedRef;

      return {
        itemId: itemId,
        itemData: itemData,
        itemType: item.itemType,
        quantity: item.quantity,
        price: item.price,
        addedAt: item.addedAt,
      };
    });
  }
  return cartObj;
};

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

    // Populate medicines and products with all needed fields
    cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: "items.medicineId",
        select:
          "name price description priceCategory effectiveness dosage disease cropType",
      })
      .populate({
        path: "items.productId",
        select: "name price description category rating stock",
      })
      .populate("user", "name email");

    // Transform and return
    res.json(transformCart(cart));
  } catch (error) {
    console.error("Cart GET error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/cart/add
// @desc    Add medicine or product to cart
// @access  Private
router.post("/add", auth, async (req, res) => {
  try {
    const {
      medicineId,
      itemId,
      itemType = "medicine",
      quantity = 1,
    } = req.body;

    // Support both old and new parameter names
    const id = itemId || medicineId;

    if (!id) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    let item;
    if (itemType === "product") {
      item = await Product.findById(id);
      if (!item) {
        return res.status(404).json({ message: "Product not found" });
      }
    } else {
      item = await Medicine.findById(id);
      if (!item) {
        return res.status(404).json({ message: "Medicine not found" });
      }
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      (cartItem) =>
        cartItem.itemId.toString() === id && cartItem.itemType === itemType,
    );

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.items.push({
        itemId: id,
        itemType: itemType,
        medicineId: itemType === "medicine" ? id : null,
        productId: itemType === "product" ? id : null,
        quantity: parseInt(quantity),
        price: item.price,
      });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.medicineId",
        select:
          "name price description priceCategory effectiveness dosage disease cropType",
      })
      .populate({
        path: "items.productId",
        select: "name price description category rating stock",
      });

    res.json({
      success: true,
      message: `${itemType === "product" ? "Product" : "Medicine"} added to cart`,
      cart: transformCart(populatedCart),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update quantity of item in cart
// @access  Private
router.put("/update/:itemId", auth, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (cartItem) => cartItem.itemId.toString() === req.params.itemId.toString(),
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = parseInt(quantity);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.medicineId",
        select:
          "name price description priceCategory effectiveness dosage disease cropType",
      })
      .populate({
        path: "items.productId",
        select: "name price description category rating stock",
      });
    res.json({
      success: true,
      message: "Cart updated",
      cart: transformCart(populatedCart),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete("/remove/:itemId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.itemId.toString() !== req.params.itemId.toString(),
    );

    await cart.save();
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.medicineId",
        select:
          "name price description priceCategory effectiveness dosage disease cropType",
      })
      .populate({
        path: "items.productId",
        select: "name price description category rating stock",
      });

    res.json({
      success: true,
      message: "Item removed from cart",
      cart: transformCart(populatedCart),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete("/clear", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared",
      cart: transformCart(cart),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/cart/checkout
// @desc    Checkout and create order
// @access  Private
router.post("/checkout", auth, async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = "cod",
      diseaseId = null,
    } = req.body;

    if (!shippingAddress || !shippingAddress.address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.itemId",
      select: "name price description priceCategory category",
    });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create order from cart
    const orderItems = cart.items.map((item) => ({
      medicine: item.itemId._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      subtotal: cart.subtotal,
      tax: cart.tax,
      total: cart.total,
      shippingAddress,
      paymentMethod,
      disease: diseaseId,
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "pending" : "completed",
    });

    await order.save();

    // Clear cart after checkout
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("items.medicine")
      .populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/cart/orders
// @desc    Get user's orders
// @access  Private
router.get("/orders/list", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.medicine", "name price")
      .populate("disease", "diseaseName status")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/cart/orders/:orderId
// @desc    Get specific order
// @access  Private
router.get("/orders/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.medicine", "name price description")
      .populate("disease", "diseaseName status")
      .populate("user", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check access
    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
