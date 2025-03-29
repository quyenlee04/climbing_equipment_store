package com.climbing.store.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.climbing.store.client.ProductClient;
import com.climbing.store.dto.CartDTO;
import com.climbing.store.dto.CartItemDTO;
import com.climbing.store.dto.ProductInfoDTO;
import com.climbing.store.model.Cart;
import com.climbing.store.model.CartItem;
import com.climbing.store.repository.CartItemRepository;
import com.climbing.store.repository.CartRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private ProductClient productClient;
    
    public CartDTO getCartByUserId(Integer userId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        
        if (cartOpt.isPresent()) {
            return convertToCartDTO(cartOpt.get());
        } else {
            // Create a new cart for the user if it doesn't exist
            Cart newCart = new Cart(userId);
            Cart savedCart = cartRepository.save(newCart);
            return convertToCartDTO(savedCart);
        }
    }
    
    @Transactional
    public CartDTO addItemToCart(Integer userId, Integer productId, Integer quantity) {
        // Get or create cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart(userId);
                    return cartRepository.save(newCart);
                });
        
        // Check if product already exists in cart
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
        
        if (existingItemOpt.isPresent()) {
            // Update quantity if item already exists
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            // Add new item to cart
            CartItem newItem = new CartItem(productId, quantity);
            cart.addCartItem(newItem);
        }
        
        // Update cart timestamp
        cart.updateTimestamp();
        Cart updatedCart = cartRepository.save(cart);
        
        return convertToCartDTO(updatedCart);
    }
    
    @Transactional
    public CartDTO updateCartItem(Integer userId, Integer itemId, Integer quantity) {
        // Get cart
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (!cartOpt.isPresent()) {
            throw new RuntimeException("Cart not found for user: " + userId);
        }
        
        Cart cart = cartOpt.get();
        
        // Find the item
        Optional<CartItem> itemOpt = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst();
        
        if (!itemOpt.isPresent()) {
            throw new RuntimeException("Item not found in cart: " + itemId);
        }
        
        CartItem item = itemOpt.get();
        
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.removeCartItem(item);
            cartItemRepository.delete(item);
        } else {
            // Update quantity
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        
        // Update cart timestamp
        cart.updateTimestamp();
        Cart updatedCart = cartRepository.save(cart);
        
        return convertToCartDTO(updatedCart);
    }
    
    @Transactional
    public CartDTO removeCartItem(Integer userId, Integer itemId) {
        // Get cart
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (!cartOpt.isPresent()) {
            throw new RuntimeException("Cart not found for user: " + userId);
        }
        
        Cart cart = cartOpt.get();
        
        // Find the item
        Optional<CartItem> itemOpt = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst();
        
        if (!itemOpt.isPresent()) {
            throw new RuntimeException("Item not found in cart: " + itemId);
        }
        
        CartItem item = itemOpt.get();
        
        // Remove item
        cart.removeCartItem(item);
        cartItemRepository.delete(item);
        
        // Update cart timestamp
        cart.updateTimestamp();
        Cart updatedCart = cartRepository.save(cart);
        
        return convertToCartDTO(updatedCart);
    }
    
    @Transactional
    public void clearCart(Integer userId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            
            // Clear all items
            cart.getCartItems().clear();
            
            // Update cart timestamp
            cart.updateTimestamp();
            cartRepository.save(cart);
        }
    }
    
    private CartDTO convertToCartDTO(Cart cart) {
        CartDTO cartDTO = new CartDTO();
        cartDTO.setId(cart.getId());
        cartDTO.setUserId(cart.getUserId());
        cartDTO.setCreatedAt(cart.getCreatedAt());
        cartDTO.setUpdatedAt(cart.getUpdatedAt());
        
        List<CartItemDTO> itemDTOs = new ArrayList<>();
        double totalPrice = 0.0;
        
        for (CartItem item : cart.getCartItems()) {
            CartItemDTO itemDTO = new CartItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProductId());
            itemDTO.setQuantity(item.getQuantity());
            
            // Get product info from product service
            try {
                ProductInfoDTO productInfo = productClient.getProductInfo(item.getProductId());
                itemDTO.setProductName(productInfo.getName());
                itemDTO.setProductSku(productInfo.getSku());
                itemDTO.setProductImageUrl(productInfo.getImageUrl());
                
                double price = productInfo.getPrice().doubleValue();
                itemDTO.setProductPrice(price);
                
                double subtotal = price * item.getQuantity();
                itemDTO.setSubtotal(subtotal);
                
                totalPrice += subtotal;
            } catch (Exception e) {
                // If product service is unavailable, set default values
                itemDTO.setProductName("Product #" + item.getProductId());
                itemDTO.setProductPrice(0.0);
                itemDTO.setSubtotal(0.0);
            }
            
            itemDTOs.add(itemDTO);
        }
        
        cartDTO.setItems(itemDTOs);
        cartDTO.setTotalPrice(totalPrice);
        
        return cartDTO;
    }
}