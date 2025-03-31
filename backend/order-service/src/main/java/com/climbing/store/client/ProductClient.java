package com.climbing.store.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.climbing.store.dto.ProductInfoDTO;

@FeignClient(name = "product-service")
public interface ProductClient {
    
    @GetMapping("/api/products/{id}/info")
    ProductInfoDTO getProductInfo(@PathVariable("id") Integer productId);
    @PutMapping("/api/products/{id}/stock")
    void updateProductStock(@PathVariable("id") Integer productId, 
                          @RequestParam("quantity") Integer quantityToReduce);
}