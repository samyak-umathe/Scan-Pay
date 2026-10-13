import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart/items', { productId, quantity });
      setCart(res.data.data);
      return res.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add to cart';
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.put(`/cart/items/${productId}`, { quantity });
      setCart(res.data.data);
      return res.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update quantity';
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      setCart(res.data.data);
      return res.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to remove from cart';
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart');
      setCart(res.data.data);
      return res.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to clear cart';
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
