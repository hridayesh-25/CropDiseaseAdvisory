import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../utils/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fetch cart on mount only
  const fetchCart = useCallback(async () => {
    if (!isMounted) return;
    try {
      setLoading(true);
      const response = await api.get("/cart");
      if (isMounted) setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      if (isMounted) setCart({ items: [], subtotal: 0, tax: 0, total: 0 });
    } finally {
      if (isMounted) setLoading(false);
    }
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (itemId, quantity = 1, itemType = "medicine") => {
      try {
        if (!itemId) {
          throw new Error("Item ID is required");
        }
        console.log(
          `Adding ${itemType} ${itemId} with quantity ${quantity} to cart`,
        );
        const response = await api.post("/cart/add", {
          medicineId: itemId, // Keep for backward compatibility
          itemId: itemId,
          itemType: itemType,
          quantity,
        });
        if (response.data && response.data.cart) {
          setCart(response.data.cart);
        }
        return response.data;
      } catch (error) {
        console.error(
          "Error adding to cart:",
          error.response?.data || error.message,
        );
        throw error;
      }
    },
    [],
  );

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/update/${itemId}`, {
        quantity,
      });
      setCart(response.data.cart);
      return response.data;
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      setCart(response.data.cart);
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete("/cart/clear");
      setCart(response.data.cart);
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const checkout = async (
    shippingAddress,
    paymentMethod = "cod",
    diseaseId = null,
  ) => {
    try {
      const response = await api.post("/cart/checkout", {
        shippingAddress,
        paymentMethod,
        diseaseId,
      });
      setCart({ items: [], subtotal: 0, tax: 0, total: 0 });
      return response.data;
    } catch (error) {
      console.error("Error during checkout:", error);
      throw error;
    }
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    getCartItemCount,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
