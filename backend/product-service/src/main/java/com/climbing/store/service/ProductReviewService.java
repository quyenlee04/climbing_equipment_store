package com.climbing.store.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.climbing.store.dto.ProductReviewDTO;
import com.climbing.store.model.Product;
import com.climbing.store.model.ProductReview;
import com.climbing.store.repository.ProductRepository;
import com.climbing.store.repository.ProductReviewRepository;

@Service
public class ProductReviewService {

    @Autowired
    private ProductReviewRepository reviewRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<ProductReviewDTO> getReviewsByProductId(Integer productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductReviewDTO> getReviewsByUserId(Integer userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProductReviewDTO getReviewById(Integer id) {
        Optional<ProductReview> reviewOpt = reviewRepository.findById(id);
        return reviewOpt.map(this::convertToDTO).orElse(null);
    }
    
    @Transactional
    public ProductReviewDTO createReview(ProductReviewDTO reviewDTO) {
        Optional<Product> productOpt = productRepository.findById(reviewDTO.getProductId());
        if (productOpt.isPresent()) {
            ProductReview review = convertToEntity(reviewDTO);
            review.setProduct(productOpt.get());
            ProductReview savedReview = reviewRepository.save(review);
            return convertToDTO(savedReview);
        }
        return null;
    }
    
    @Transactional
    public ProductReviewDTO updateReview(Integer id, ProductReviewDTO reviewDTO) {
        Optional<ProductReview> existingReviewOpt = reviewRepository.findById(id);
        if (existingReviewOpt.isPresent()) {
            ProductReview existingReview = existingReviewOpt.get();
            updateReviewFromDTO(existingReview, reviewDTO);
            ProductReview updatedReview = reviewRepository.save(existingReview);
            return convertToDTO(updatedReview);
        }
        return null;
    }
    
    @Transactional
    public boolean deleteReview(Integer id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private ProductReviewDTO convertToDTO(ProductReview review) {
        ProductReviewDTO dto = new ProductReviewDTO();
        dto.setId(review.getId());
        dto.setProductId(review.getProduct().getId());
        dto.setProductName(review.getProduct().getName());
        dto.setUserId(review.getUserId());
        dto.setRating(review.getRating());
        dto.setReviewText(review.getReviewText());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
    
    private ProductReview convertToEntity(ProductReviewDTO dto) {
        ProductReview review = new ProductReview();
        updateReviewFromDTO(review, dto);
        return review;
    }
    
    private void updateReviewFromDTO(ProductReview review, ProductReviewDTO dto) {
        review.setUserId(dto.getUserId());
        review.setRating(dto.getRating());
        review.setReviewText(dto.getReviewText());
    }
}