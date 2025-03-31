package com.climbing.store.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.climbing.store.dto.ProductInfoDTO;

@FeignClient(name = "product-service")
public interface ProductClient {
    @GetMapping("/products/{id}/info")
    ProductInfoDTO getProductInfo(@PathVariable("id") Integer productId);
}