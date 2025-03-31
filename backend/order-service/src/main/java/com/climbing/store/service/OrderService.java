package com.climbing.store.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.climbing.store.client.ProductClient;
import com.climbing.store.dto.OrderDTO;
import com.climbing.store.dto.OrderItemDTO;
import com.climbing.store.model.Order;
import com.climbing.store.model.OrderItem;
import com.climbing.store.model.OrderStatus;
import com.climbing.store.model.PaymentStatus;
import com.climbing.store.repository.OrderItemRepository;
import com.climbing.store.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private ProductClient productClient; // Add this for product service communication
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<OrderDTO> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public OrderDTO getOrderById(Integer id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        return orderOpt.map(this::convertToDTO).orElse(null);
    }
    
    public OrderDTO getOrderByOrderNumber(String orderNumber) {
        Optional<Order> orderOpt = orderRepository.findByOrderNumber(orderNumber);
        return orderOpt.map(this::convertToDTO).orElse(null);
    }
    
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = convertToEntity(orderDTO);
        
        // Generate order number
        order.setOrderNumber(generateOrderNumber());
        order.setOrderDate(LocalDateTime.now());
        
        // Set initial statuses
        if (order.getOrderStatus() == null) {
            order.setOrderStatus(OrderStatus.PENDING);
        }
        
        if (order.getPaymentStatus() == null) {
            order.setPaymentStatus(PaymentStatus.PENDING);
        }
        
        // Calculate totals
        calculateOrderTotals(order);
        
        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }
    
    @Transactional
    public OrderDTO updateOrder(Integer id, OrderDTO orderDTO) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);
        if (existingOrderOpt.isPresent()) {
            Order existingOrder = existingOrderOpt.get();
            updateOrderFromDTO(existingOrder, orderDTO);
            
            // Recalculate totals
            calculateOrderTotals(existingOrder);
            
            Order updatedOrder = orderRepository.save(existingOrder);
            return convertToDTO(updatedOrder);
        }
        return null;
    }
    
    @Transactional
    public boolean deleteOrder(Integer id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    @Transactional
    public OrderDTO updateOrderStatus(Integer id, OrderStatus status) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setOrderStatus(status);
            Order updatedOrder = orderRepository.save(order);
            return convertToDTO(updatedOrder);
        }
        return null;
    }
    
    @Transactional
    public OrderDTO updatePaymentStatus(Integer id, PaymentStatus status) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            // If payment is being marked as completed
            if (status == PaymentStatus.COMPLETED && order.getPaymentStatus() != PaymentStatus.COMPLETED) {
                // Update product quantities
                try {
                    updateProductQuantities(order);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to update product quantities: " + e.getMessage());
                }
            }
            
            order.setPaymentStatus(status);
            Order updatedOrder = orderRepository.save(order);
            return convertToDTO(updatedOrder);
        }
        return null;
    }

    private void updateProductQuantities(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            // Call product service to update quantity
            productClient.updateProductStock(
                item.getProductId(),
                item.getQuantity()
            );
        }
    }
    
    private String generateOrderNumber() {
        // Format: ORD-YYYYMMDD-XXXX (where XXXX is a random string)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String datePart = LocalDateTime.now().format(formatter);
        String randomPart = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        
        return "ORD-" + datePart + "-" + randomPart;
    }
    
    private void calculateOrderTotals(Order order) {
        // Calculate subtotals for each item
        for (OrderItem item : order.getOrderItems()) {
            item.calculateSubtotal();
        }
        
        // Calculate order total
        BigDecimal itemsTotal = order.getOrderItems().stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Add shipping cost
        BigDecimal total = itemsTotal;
        if (order.getShippingCost() != null) {
            total = total.add(order.getShippingCost());
        }
        
        // Add tax
        if (order.getTaxAmount() != null) {
            total = total.add(order.getTaxAmount());
        }
        
        // Subtract discount
        if (order.getDiscountAmount() != null) {
            total = total.subtract(order.getDiscountAmount());
        }
        
        order.setTotalAmount(total);
    }
    
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddressId(order.getShippingAddressId());
        dto.setBillingAddressId(order.getBillingAddressId());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setShippingMethod(order.getShippingMethod());
        dto.setShippingCost(order.getShippingCost());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setNotes(order.getNotes());
        
        // Convert order items
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        dto.setOrderItems(itemDTOs);
        
        return dto;
    }
    
    private OrderItemDTO convertToDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setOrderId(item.getOrder().getId());
        dto.setProductId(item.getProductId());
        dto.setProductName(item.getProductName());
        dto.setProductSku(item.getProductSku());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setSubtotal(item.getSubtotal());
        return dto;
    }
    
    private Order convertToEntity(OrderDTO dto) {
        Order order = new Order();
        updateOrderFromDTO(order, dto);
        return order;
    }
    
    private void updateOrderFromDTO(Order order, OrderDTO dto) {
        order.setUserId(dto.getUserId());
        // Don't update order number if it already exists
        if (order.getOrderNumber() == null) {
            order.setOrderNumber(dto.getOrderNumber());
        }
        // Don't update order date if it already exists
        if (order.getOrderDate() == null) {
            order.setOrderDate(dto.getOrderDate());
        }
        order.setShippingAddressId(dto.getShippingAddressId());
        order.setBillingAddressId(dto.getBillingAddressId());
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setPaymentStatus(dto.getPaymentStatus());
        order.setOrderStatus(dto.getOrderStatus());
        order.setShippingMethod(dto.getShippingMethod());
        order.setShippingCost(dto.getShippingCost());
        order.setTaxAmount(dto.getTaxAmount());
        order.setDiscountAmount(dto.getDiscountAmount());
        order.setNotes(dto.getNotes());
        
        // Handle order items
        if (dto.getOrderItems() != null && !dto.getOrderItems().isEmpty()) {
            // Clear existing items and add new ones
            order.getOrderItems().clear();
            
            for (OrderItemDTO itemDTO : dto.getOrderItems()) {
                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProductId(itemDTO.getProductId());
                item.setProductName(itemDTO.getProductName());
                item.setProductSku(itemDTO.getProductSku());
                item.setQuantity(itemDTO.getQuantity());
                item.setUnitPrice(itemDTO.getUnitPrice());
                item.setPriceAtTime(itemDTO.getPriceAtTime());
                item.calculateSubtotal();
                
                order.addOrderItem(item);
            }
        }
    }
}