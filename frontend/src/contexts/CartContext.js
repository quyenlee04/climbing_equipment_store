import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const cartData = await cartService.getCart(user.id);
      setCart(cartData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  

  const addToCart = async (productId, quantity) => {
    if (!user?.id) return;
    setLoading(true);
    
    try {
      const updatedCart = await cartService.addToCart(user.id, productId, quantity);
      setCart(updatedCart);
      setError(null);
      // Fetch cart again to ensure we have the latest state
      await fetchCart();
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!user?.id || !itemId) return;
    setLoading(true);
    try {
      const updatedCart = await cartService.updateCartItem(user.id, itemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      setError(err.message);
      console.error('Error updating cart:', err);
      
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const updatedCart = await cartService.removeFromCart(user.id, itemId);
      setCart(updatedCart);
    } catch (err) {
      setError(err.message);
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await cartService.clearCart(user.id);
      setCart({ items: [], totalPrice: 0 });
    } catch (err) {
      setError(err.message);
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  };
  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user]);
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
