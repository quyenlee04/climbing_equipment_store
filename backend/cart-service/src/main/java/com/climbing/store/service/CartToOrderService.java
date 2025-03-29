package com.climbing.store.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.climbing.store.client.ProductClient;
import com.climbing.store.dto.CartDTO;
import com.climbing.store.dto.CartItemDTO;
import com.climbing.store.dto.ProductInfoDTO;
import com.climbing.store.repository.CartRepository;

@Service
public class CartToOrderService {

    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductClient productClient;
    
    @Autowired
    private CartService cartService;
    
    public Map<String, Object> prepareOrderFromCart(Integer userId) {
        CartDTO cartDTO = cartService.getCartByUserId(userId);
        
        if (cartDTO.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create order from empty cart");
        }
        
        Map<String, Object> orderData = new HashMap<>();
        orderData.put("userId", userId);
        
        List<Map<String, Object>> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (CartItemDTO item : cartDTO.getItems()) {
            // Get latest product info to ensure price is current
            ProductInfoDTO productInfo = productClient.getProductInfo(item.getProductId());
            
            // Check stock availability
            if (productInfo.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + productInfo.getName());
            }
            
            Map<String, Object> orderItem = new HashMap<>();
            orderItem.put("productId", item.getProductId());
            orderItem.put("productName", productInfo.getName());
            orderItem.put("productSku", productInfo.getSku());
            orderItem.put("quantity", item.getQuantity());
            orderItem.put("unitPrice", productInfo.getPrice());
            
            BigDecimal itemTotal = productInfo.getPrice().multiply(new BigDecimal(item.getQuantity()));
            orderItem.put("subtotal", itemTotal);
            
            orderItems.add(orderItem);
            totalAmount = totalAmount.add(itemTotal);
        }
        
        orderData.put("items", orderItems);
        orderData.put("totalAmount", totalAmount);
        
        return orderData;
    }
    
    public void clearCartAfterOrder(Integer userId) {
        cartService.clearCart(userId);
    }
}