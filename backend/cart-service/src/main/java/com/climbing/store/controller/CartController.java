package com.climbing.store.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.climbing.store.dto.CartDTO;
import com.climbing.store.payload.request.AddToCartRequest;
import com.climbing.store.payload.request.UpdateCartItemRequest;
import com.climbing.store.payload.response.MessageResponse;
import com.climbing.store.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<CartDTO> getCartByUserId(@PathVariable Integer userId) {
        CartDTO cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/user/{userId}/items")
    public ResponseEntity<CartDTO> addItemToCart(
            @PathVariable Integer userId,
            @RequestBody AddToCartRequest request) {
        CartDTO updatedCart = cartService.addItemToCart(
                userId, 
                request.getProductId(), 
                request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }
    
    @PutMapping("/user/{userId}/items/{itemId}")
    public ResponseEntity<CartDTO> updateCartItem(
            @PathVariable Integer userId,
            @PathVariable Integer itemId,
            @RequestBody UpdateCartItemRequest request) {
        CartDTO updatedCart = cartService.updateCartItem(
                userId, 
                itemId, 
                request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }
    
    @DeleteMapping("/user/{userId}/items/{itemId}")
    public ResponseEntity<CartDTO> removeCartItem(
            @PathVariable Integer userId,
            @PathVariable Integer itemId) {
        CartDTO updatedCart = cartService.removeCartItem(userId, itemId);
        return ResponseEntity.ok(updatedCart);
    }
    
    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<MessageResponse> clearCart(@PathVariable Integer userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(new MessageResponse("Cart cleared successfully"));
    }
}