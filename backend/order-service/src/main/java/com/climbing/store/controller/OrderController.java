package com.climbing.store.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.climbing.store.client.ProductClient;
import com.climbing.store.dto.OrderDTO;
import com.climbing.store.dto.OrderItemDTO;
import com.climbing.store.dto.ProductInfoDTO;
import com.climbing.store.model.OrderStatus;
import com.climbing.store.model.PaymentStatus;
import com.climbing.store.payload.request.CreateOrderRequest;
import com.climbing.store.payload.request.OrderItemRequest;
import com.climbing.store.payload.response.MessageResponse;
import com.climbing.store.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private ProductClient productClient;
    
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable Integer userId) {
        List<OrderDTO> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Integer id) {
        OrderDTO order = orderService.getOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderDTO> getOrderByOrderNumber(@PathVariable String orderNumber) {
        OrderDTO order = orderService.getOrderByOrderNumber(orderNumber);
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest createRequest) {
        try {
            // Convert request to OrderDTO
            OrderDTO orderDTO = new OrderDTO();
            orderDTO.setUserId(createRequest.getUserId());
            orderDTO.setShippingAddressId(createRequest.getShippingAddressId());
            orderDTO.setBillingAddressId(createRequest.getBillingAddressId());
            orderDTO.setPaymentMethod(createRequest.getPaymentMethod());
            orderDTO.setShippingMethod(createRequest.getShippingMethod());
            orderDTO.setShippingCost(createRequest.getShippingCost());
            orderDTO.setTaxAmount(createRequest.getTaxAmount());
            orderDTO.setDiscountAmount(createRequest.getDiscountAmount());
            orderDTO.setNotes(createRequest.getNotes());
            
            // Convert order items
            List<OrderItemDTO> itemDTOs = new ArrayList<>();
            for (OrderItemRequest itemRequest : createRequest.getItems()) {
                OrderItemDTO itemDTO = new OrderItemDTO();
                itemDTO.setProductId(itemRequest.getProductId());
                
                // Try to get product info from product service
                try {
                    ProductInfoDTO productInfo = productClient.getProductInfo(itemRequest.getProductId());
                    itemDTO.setProductName(productInfo.getName());
                    itemDTO.setProductSku(productInfo.getSku());
                    itemDTO.setUnitPrice(productInfo.getPrice());
                } catch (Exception e) {
                    // If product service is unavailable, use the provided info
                    itemDTO.setProductName(itemRequest.getProductName());
                    itemDTO.setProductSku(itemRequest.getProductSku());
                    itemDTO.setUnitPrice(itemRequest.getUnitPrice());
                }
                
                itemDTO.setQuantity(itemRequest.getQuantity());
                itemDTOs.add(itemDTO);
            }
            orderDTO.setOrderItems(itemDTOs);
            
            // Create the order
            OrderDTO createdOrder = orderService.createOrder(orderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error creating order: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Integer id, @RequestBody OrderDTO orderDTO) {
        OrderDTO updatedOrder = orderService.updateOrder(id, orderDTO);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        boolean deleted = orderService.deleteOrder(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Integer id, 
            @RequestParam OrderStatus status) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PatchMapping("/{id}/payment")
    public ResponseEntity<OrderDTO> updatePaymentStatus(
            @PathVariable Integer id, 
            @RequestParam PaymentStatus status) {
        OrderDTO updatedOrder = orderService.updatePaymentStatus(id, status);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }
}