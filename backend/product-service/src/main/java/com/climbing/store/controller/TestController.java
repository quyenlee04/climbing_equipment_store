package com.climbing.store.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Value("${spring.application.name:unknown}")
    private String applicationName;

    @GetMapping("/test")
    public String test() {
        return "Product Service is working! Application name: " + applicationName;
    }
    
    @GetMapping("/api/test")
    public String apiTest() {
        return "API Test endpoint is working!";
    }
}