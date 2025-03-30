import React, { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fetch cart on auth state change
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    } else {
      // If not authenticated, load cart from localStorage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      } else {
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      }
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const cartData = await cartService.getCart(user.id);
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Add to server cart
        const updatedCart = await cartService.addToCart(user.id, productId, quantity);
        setCart(updatedCart);
      } else {
        // Add to local cart
        const updatedItems = [...cart.items];
        const existingItemIndex = updatedItems.findIndex(item => item.productId === productId);
        
        if (existingItemIndex >= 0) {
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          // Fetch product details
          const product = await cartService.getProductDetails(productId);
          updatedItems.push({
            productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity
          });
        }
        
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        setCart({
          items: updatedItems,
          totalItems,
          totalPrice
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Update server cart
        const updatedCart = await cartService.updateCartItem(user.id, productId, quantity);
        setCart(updatedCart);
      } else {
        // Update local cart
        const updatedItems = [...cart.items];
        const itemIndex = updatedItems.findIndex(item => item.productId === productId);
        
        if (itemIndex >= 0) {
          if (quantity <= 0) {
            updatedItems.splice(itemIndex, 1);
          } else {
            updatedItems[itemIndex].quantity = quantity;
          }
          
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          setCart({
            items: updatedItems,
            totalItems,
            totalPrice
          });
        }
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Remove from server cart
        const updatedCart = await cartService.removeFromCart(user.id, productId);
        setCart(updatedCart);
      } else {
        // Remove from local cart
        const updatedItems = cart.items.filter(item => item.productId !== productId);
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        setCart({
          items: updatedItems,
          totalItems,
          totalPrice
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Clear server cart
        await cartService.clearCart(user.id);
      }
      
      // Clear local cart state
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      
      if (!isAuthenticated) {
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Merge local cart with server cart on login
  const mergeWithServerCart = async () => {
    if (!isAuthenticated || !user || cart.items.length === 0) return;
    
    setLoading(true);
    try {
      // Get current server cart
      const serverCart = await cartService.getCart(user.id);
      
      // Add local items to server cart
      for (const item of cart.items) {
        await cartService.addToCart(user.id, item.productId, item.quantity);
      }
      
      // Clear local storage cart
      localStorage.removeItem('cart');
      
      // Fetch updated cart
      const updatedCart = await cartService.getCart(user.id);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error merging carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    mergeWithServerCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };