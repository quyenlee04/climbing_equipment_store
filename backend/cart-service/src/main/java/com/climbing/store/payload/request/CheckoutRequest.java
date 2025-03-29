package com.climbing.store.payload.request;

public class CheckoutRequest {
    private Integer shippingAddressId;
    private Integer billingAddressId;
    private String paymentMethod;
    private String shippingMethod;
    
    // Getters and Setters
    public Integer getShippingAddressId() {
        return shippingAddressId;
    }
    
    public void setShippingAddressId(Integer shippingAddressId) {
        this.shippingAddressId = shippingAddressId;
    }
    
    public Integer getBillingAddressId() {
        return billingAddressId;
    }
    
    public void setBillingAddressId(Integer billingAddressId) {
        this.billingAddressId = billingAddressId;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getShippingMethod() {
        return shippingMethod;
    }
    
    public void setShippingMethod(String shippingMethod) {
        this.shippingMethod = shippingMethod;
    }
}