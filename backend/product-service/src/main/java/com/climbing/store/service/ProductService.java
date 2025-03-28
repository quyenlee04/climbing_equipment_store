package com.climbing.store.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.climbing.store.dto.ProductDTO;
import com.climbing.store.dto.ProductImageDTO;
import com.climbing.store.model.Product;
import com.climbing.store.model.ProductImage;
import com.climbing.store.model.ProductReview;
import com.climbing.store.repository.BrandRepository;
import com.climbing.store.repository.CategoryRepository;
import com.climbing.store.repository.ProductImageRepository;
import com.climbing.store.repository.ProductRepository;
import com.climbing.store.repository.ProductReviewRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductImageRepository productImageRepository;
    
    @Autowired
    private ProductReviewRepository productReviewRepository;
    
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getActiveProducts() {
        return productRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProductDTO getProductById(Integer id) {
        Optional<Product> productOpt = productRepository.findById(id);
        return productOpt.map(this::convertToDTO).orElse(null);
    }
    
    public ProductDTO getProductBySku(String sku) {
        Optional<Product> productOpt = productRepository.findBySku(sku);
        return productOpt.map(this::convertToDTO).orElse(null);
    }
    
    public List<ProductDTO> getProductsByCategory(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getProductsByBrand(Integer brandId) {
        return productRepository.findByBrandId(brandId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }
    
    @Transactional
    public ProductDTO updateProduct(Integer id, ProductDTO productDTO) {
        Optional<Product> existingProductOpt = productRepository.findById(id);
        if (existingProductOpt.isPresent()) {
            Product existingProduct = existingProductOpt.get();
            updateProductFromDTO(existingProduct, productDTO);
            Product updatedProduct = productRepository.save(existingProduct);
            return convertToDTO(updatedProduct);
        }
        return null;
    }
    
    @Transactional
    public boolean deleteProduct(Integer id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    @Transactional
    public boolean deactivateProduct(Integer id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setIsActive(false);
            productRepository.save(product);
            return true;
        }
        return false;
    }
    
    @Transactional
    public boolean activateProduct(Integer id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setIsActive(true);
            productRepository.save(product);
            return true;
        }
        return false;
    }
    
    @Transactional
    public ProductDTO addProductImage(Integer productId, ProductImageDTO imageDTO) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            
            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setImageUrl(imageDTO.getImageUrl());
            image.setIsPrimary(imageDTO.getIsPrimary());
            
            // If this is set as primary, unset any existing primary images
            if (Boolean.TRUE.equals(imageDTO.getIsPrimary())) {
                product.getImages().forEach(img -> img.setIsPrimary(false));
            }
            
            product.getImages().add(image);
            Product updatedProduct = productRepository.save(product);
            return convertToDTO(updatedProduct);
        }
        return null;
    }
    
    @Transactional
    public boolean removeProductImage(Integer productId, Integer imageId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            boolean removed = product.getImages().removeIf(img -> img.getId().equals(imageId));
            if (removed) {
                productRepository.save(product);
                return true;
            }
        }
        return false;
    }
    
    @Transactional
    public boolean setPrimaryImage(Integer productId, Integer imageId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            
            // Reset all images to non-primary
            product.getImages().forEach(img -> img.setIsPrimary(false));
            
            // Set the selected image as primary
            boolean found = false;
            for (ProductImage img : product.getImages()) {
                if (img.getId().equals(imageId)) {
                    img.setIsPrimary(true);
                    found = true;
                    break;
                }
            }
            
            if (found) {
                productRepository.save(product);
                return true;
            }
        }
        return false;
    }
    
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        
        if (product.getBrand() != null) {
            dto.setBrandId(product.getBrand().getId());
            dto.setBrandName(product.getBrand().getName());
        }
        
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setWeight(product.getWeight());
        dto.setDimensions(product.getDimensions());
        dto.setSku(product.getSku());
        dto.setIsActive(product.getIsActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        
        // Convert images
        List<ProductImageDTO> imageDTOs = new ArrayList<>();
        for (ProductImage image : product.getImages()) {
            ProductImageDTO imageDTO = new ProductImageDTO();
            imageDTO.setId(image.getId());
            imageDTO.setProductId(product.getId());
            imageDTO.setImageUrl(image.getImageUrl());
            imageDTO.setIsPrimary(image.getIsPrimary());
            
            imageDTOs.add(imageDTO);
            
            if (Boolean.TRUE.equals(image.getIsPrimary())) {
                dto.setPrimaryImageUrl(image.getImageUrl());
            }
        }
        dto.setImages(imageDTOs);
        
        // If no primary image is set but there are images, use the first one
        if (dto.getPrimaryImageUrl() == null && !imageDTOs.isEmpty()) {
            dto.setPrimaryImageUrl(imageDTOs.get(0).getImageUrl());
        }
        
        // Calculate average rating
        List<ProductReview> reviews = productReviewRepository.findByProductId(product.getId());
        if (!reviews.isEmpty()) {
            double avgRating = reviews.stream()
                    .mapToInt(ProductReview::getRating)
                    .average()
                    .orElse(0.0);
            dto.setAverageRating(avgRating);
            dto.setReviewCount(reviews.size());
        } else {
            dto.setAverageRating(0.0);
            dto.setReviewCount(0);
        }
        
        return dto;
    }
    
    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        updateProductFromDTO(product, dto);
        return product;
    }
    
    private void updateProductFromDTO(Product product, ProductDTO dto) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        
        if (dto.getBrandId() != null) {
            brandRepository.findById(dto.getBrandId())
                    .ifPresent(product::setBrand);
        }
        
        if (dto.getCategoryId() != null) {
            categoryRepository.findById(dto.getCategoryId())
                    .ifPresent(product::setCategory);
        }
        
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setWeight(dto.getWeight());
        product.setDimensions(dto.getDimensions());
        product.setSku(dto.getSku());
        product.setIsActive(dto.getIsActive());
    }
}