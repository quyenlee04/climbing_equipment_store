package com.climbing.store.controller;

import com.climbing.store.client.OrderClient;
import com.climbing.store.payload.request.CheckoutRequest;
import com.climbing.store.payload.response.MessageResponse;
import com.climbing.store.service.CartToOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    @Autowired
    private CartToOrderService cartToOrderService;
    
    @Autowired
    private OrderClient orderClient;
    
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> checkout(
            @PathVariable Integer userId,
            @RequestBody CheckoutRequest checkoutRequest) {
        try {
            // Prepare order data from cart
            Map<String, Object> orderData = cartToOrderService.prepareOrderFromCart(userId);
            
            // Add shipping and billing information
            orderData.put("shippingAddressId", checkoutRequest.getShippingAddressId());
            orderData.put("billingAddressId", checkoutRequest.getBillingAddressId());
            orderData.put("paymentMethod", checkoutRequest.getPaymentMethod());
            orderData.put("shippingMethod", checkoutRequest.getShippingMethod());
            
            // Create order via order service
            ResponseEntity<?> orderResponse = orderClient.createOrder(orderData);
            
            // Clear cart after successful order
            cartToOrderService.clearCartAfterOrder(userId);
            
            return ResponseEntity.ok(orderResponse.getBody());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Checkout failed: " + e.getMessage()));
        }
    }
}