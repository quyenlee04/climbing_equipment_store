package com.climbing.store.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.climbing.store.dto.BrandDTO;
import com.climbing.store.model.Brand;
import com.climbing.store.repository.BrandRepository;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;
    
    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<BrandDTO> getActiveBrands() {
        return brandRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public BrandDTO getBrandById(Integer id) {
        Optional<Brand> brandOpt = brandRepository.findById(id);
        return brandOpt.map(this::convertToDTO).orElse(null);
    }
    
    public List<BrandDTO> searchBrands(String keyword) {
        return brandRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BrandDTO createBrand(BrandDTO brandDTO) {
        Brand brand = convertToEntity(brandDTO);
        Brand savedBrand = brandRepository.save(brand);
        return convertToDTO(savedBrand);
    }
    
    @Transactional
    public BrandDTO updateBrand(Integer id, BrandDTO brandDTO) {
        Optional<Brand> existingBrandOpt = brandRepository.findById(id);
        if (existingBrandOpt.isPresent()) {
            Brand existingBrand = existingBrandOpt.get();
            updateBrandFromDTO(existingBrand, brandDTO);
            Brand updatedBrand = brandRepository.save(existingBrand);
            return convertToDTO(updatedBrand);
        }
        return null;
    }
    
    @Transactional
    public boolean deleteBrand(Integer id) {
        if (brandRepository.existsById(id)) {
            brandRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    @Transactional
    public boolean deactivateBrand(Integer id) {
        Optional<Brand> brandOpt = brandRepository.findById(id);
        if (brandOpt.isPresent()) {
            Brand brand = brandOpt.get();
            brand.setIsActive(false);
            brandRepository.save(brand);
            return true;
        }
        return false;
    }
    
    @Transactional
    public boolean activateBrand(Integer id) {
        Optional<Brand> brandOpt = brandRepository.findById(id);
        if (brandOpt.isPresent()) {
            Brand brand = brandOpt.get();
            brand.setIsActive(true);
            brandRepository.save(brand);
            return true;
        }
        return false;
    }
    
    private BrandDTO convertToDTO(Brand brand) {
        BrandDTO dto = new BrandDTO();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setDescription(brand.getDescription());
        dto.setWebsiteUrl(brand.getWebsiteUrl());
        dto.setIsActive(brand.getIsActive());
        dto.setCreatedAt(brand.getCreatedAt());
        dto.setProductCount(brand.getProducts().size());
        return dto;
    }
    
    private Brand convertToEntity(BrandDTO dto) {
        Brand brand = new Brand();
        updateBrandFromDTO(brand, dto);
        return brand;
    }
    
    private void updateBrandFromDTO(Brand brand, BrandDTO dto) {
        brand.setName(dto.getName());
        brand.setDescription(dto.getDescription());
        brand.setWebsiteUrl(dto.getWebsiteUrl());
        brand.setIsActive(dto.getIsActive());
    }
}