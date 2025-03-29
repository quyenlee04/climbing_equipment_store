package com.climbing.store.client;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "order-service")
public interface OrderClient {
    
    @PostMapping("/api/orders")
    ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData);
}