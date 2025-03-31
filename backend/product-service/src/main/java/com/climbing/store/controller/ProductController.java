package com.climbing.store.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.climbing.store.dto.ProductDTO;
import com.climbing.store.dto.ProductImageDTO;
import com.climbing.store.dto.ProductInfoDTO;
import com.climbing.store.model.ProductImage;
import com.climbing.store.repository.ProductImageRepository;
import com.climbing.store.service.FileStorageService;
import com.climbing.store.service.ProductService;
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductImageRepository productImageRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(
            @RequestParam(required = false) Boolean active) {
        List<ProductDTO> products;
        if (Boolean.TRUE.equals(active)) {
            products = productService.getActiveProducts();
        } else {
            products = productService.getAllProducts();
        }
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        ProductDTO product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProductDTO> getProductBySku(@PathVariable String sku) {
        ProductDTO product = productService.getProductBySku(sku);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable Integer categoryId) {
        List<ProductDTO> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<List<ProductDTO>> getProductsByBrand(@PathVariable Integer brandId) {
        List<ProductDTO> products = productService.getProductsByBrand(brandId);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String keyword) {
        List<ProductDTO> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "brandId", required = false) Integer brandId,
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "weight", required = false) BigDecimal weight,
            @RequestParam(value = "dimensions", required = false) String dimensions,
            @RequestParam(value = "isActive", required = false, defaultValue = "true") Boolean isActive,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setName(name);
            productDTO.setDescription(description);
            productDTO.setPrice(price);
            productDTO.setStockQuantity(stockQuantity);
            productDTO.setCategoryId(categoryId);
            productDTO.setBrandId(brandId);
            productDTO.setSku(sku);
            productDTO.setWeight(weight);
            productDTO.setDimensions(dimensions);
            productDTO.setIsActive(isActive);
            
            // Create the product first
            ProductDTO createdProduct = productService.createProduct(productDTO);
            
            // If an image was uploaded, store it and add it to the product
            if (image != null && !image.isEmpty()) {
                String filename = fileStorageService.storeFile(image);
                
                // Create image DTO
                ProductImageDTO imageDTO = new ProductImageDTO();
                imageDTO.setImageUrl(filename);
                imageDTO.setIsPrimary(true);
                
                // Add image to product
                productService.addProductImage(createdProduct.getId(), imageDTO);
                
                // Fetch the updated product
                createdProduct = productService.getProductById(createdProduct.getId());
            }
            
            return ResponseEntity.ok(createdProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Integer id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "stockQuantity", required = false) Integer stockQuantity,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "brandId", required = false) Integer brandId,
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "weight", required = false) BigDecimal weight,
            @RequestParam(value = "dimensions", required = false) String dimensions,
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            // Get existing product
            ProductDTO existingProduct = productService.getProductById(id);
            if (existingProduct == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Update fields if provided
            if (name != null) existingProduct.setName(name);
            if (description != null) existingProduct.setDescription(description);
            if (price != null) existingProduct.setPrice(price);
            if (stockQuantity != null) existingProduct.setStockQuantity(stockQuantity);
            if (categoryId != null) existingProduct.setCategoryId(categoryId);
            if (brandId != null) existingProduct.setBrandId(brandId);
            if (sku != null) existingProduct.setSku(sku);
            if (weight != null) existingProduct.setWeight(weight);
            if (dimensions != null) existingProduct.setDimensions(dimensions);
            if (isActive != null) existingProduct.setIsActive(isActive);
            
            // Update the product
            ProductDTO updatedProduct = productService.updateProduct(id, existingProduct);
            
            // If an image was uploaded, store it and add it to the product
            if (image != null && !image.isEmpty()) {
                String filename = fileStorageService.storeFile(image);
                
                // Create image DTO
                ProductImageDTO imageDTO = new ProductImageDTO();
                imageDTO.setImageUrl(filename);
                imageDTO.setIsPrimary(true);
                
                // Add image to product
                productService.addProductImage(updatedProduct.getId(), imageDTO);
                
                // Fetch the updated product
                updatedProduct = productService.getProductById(updatedProduct.getId());
            }
            
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateProduct(@PathVariable Integer id) {
        boolean deactivated = productService.deactivateProduct(id);
        if (deactivated) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateProduct(@PathVariable Integer id) {
        boolean activated = productService.activateProduct(id);
        if (activated) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{id}/images/upload")
    public ResponseEntity<ProductDTO> addProductImage(
        @PathVariable Integer id,
        @RequestParam("image") MultipartFile image,
        @RequestParam(value = "isPrimary", required = false, defaultValue = "false") Boolean isPrimary) {
    
    try {
        // Store the file
        String filename = fileStorageService.storeFile(image);
        
        // Create image DTO
        ProductImageDTO imageDTO = new ProductImageDTO();
        imageDTO.setImageUrl(filename);
        imageDTO.setIsPrimary(isPrimary);
        
        // Add image to product
        ProductDTO updatedProduct = productService.addProductImage(id, imageDTO);
        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(updatedProduct);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
    // Keep the original method for JSON requests
    @PostMapping("/{id}/images")
public ResponseEntity<ProductDTO> addProductImage(
        @PathVariable Integer id, 
        @RequestBody ProductImageDTO imageDTO) {
    ProductDTO updatedProduct = productService.addProductImage(id, imageDTO);
    if (updatedProduct != null) {
        return ResponseEntity.status(HttpStatus.CREATED).body(updatedProduct);
    }
    return ResponseEntity.notFound().build();
}

    @DeleteMapping("/{productId}/images/{imageId}")
    public ResponseEntity<Void> removeProductImage(
            @PathVariable Integer productId, 
            @PathVariable Integer imageId) {
        boolean removed = productService.removeProductImage(productId, imageId);
        if (removed) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{productId}/images/{imageId}/primary")
    public ResponseEntity<Void> setPrimaryImage(
            @PathVariable Integer productId, 
            @PathVariable Integer imageId) {
        boolean updated = productService.setPrimaryImage(productId, imageId);
        if (updated) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Add this method to your existing ProductController class
    
    @GetMapping("/{id}/info")
    public ResponseEntity<ProductInfoDTO> getProductInfo(@PathVariable Integer id) {
        ProductDTO product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        
        ProductInfoDTO productInfo = new ProductInfoDTO();
        productInfo.setId(product.getId());
        productInfo.setName(product.getName());
        productInfo.setSku(product.getSku());
        productInfo.setPrice(product.getPrice());
        productInfo.setStockQuantity(product.getStockQuantity());
        
        // Get primary image if available
        ProductImage primaryImage = productImageRepository.findByProductIdAndIsPrimaryTrue(id);
        if (primaryImage != null) {
            productInfo.setImageUrl(primaryImage.getImageUrl());
        }
        
        return ResponseEntity.ok(productInfo);
    }
    
    @PutMapping("/{id}/stock")
    public ResponseEntity<Void> updateProductStock(
            @PathVariable Integer id,
            @RequestParam Integer quantity) {
        try {
            ProductDTO product = productService.getProductById(id);
            if (product == null) {
                return ResponseEntity.notFound().build();
            }

            int newQuantity = product.getStockQuantity() - quantity;
            if (newQuantity < 0) {
                return ResponseEntity.badRequest().build();
            }

            product.setStockQuantity(newQuantity);
            productService.updateProduct(id, product);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}