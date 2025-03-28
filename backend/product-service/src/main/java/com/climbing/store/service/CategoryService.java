package com.climbing.store.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.climbing.store.dto.CategoryDTO;
import com.climbing.store.model.Category;
import com.climbing.store.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

    }
    
    public List<CategoryDTO> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<CategoryDTO> getRootCategories() {
        return categoryRepository.findByParentCategoryIsNull().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<CategoryDTO> getSubcategories(Integer parentId) {
        return categoryRepository.findByParentCategoryId(parentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public CategoryDTO getCategoryById(Integer id) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        return categoryOpt.map(this::convertToDTO).orElse(null);
    }
    
    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = convertToEntity(categoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }
    
    @Transactional
    public CategoryDTO updateCategory(Integer id, CategoryDTO categoryDTO) {
        Optional<Category> existingCategoryOpt = categoryRepository.findById(id);
        if (existingCategoryOpt.isPresent()) {
            Category existingCategory = existingCategoryOpt.get();
            updateCategoryFromDTO(existingCategory, categoryDTO);
            Category updatedCategory = categoryRepository.save(existingCategory);
            return convertToDTO(updatedCategory);
        }
        return null;
    }
    
    @Transactional
    public boolean deleteCategory(Integer id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    @Transactional
    public boolean deactivateCategory(Integer id) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            category.setIsActive(false);
            categoryRepository.save(category);
            return true;
        }
        return false;
    }
    
    @Transactional
    public boolean activateCategory(Integer id) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            category.setIsActive(true);
            categoryRepository.save(category);
            return true;
        }
        return false;
    }
    
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        
        if (category.getParentCategory() != null) {
            dto.setParentCategoryId(category.getParentCategory().getId());
            dto.setParentCategoryName(category.getParentCategory().getName());
        }
        
        dto.setIsActive(category.getIsActive());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());
        
        // Convert subcategories
        List<CategoryDTO> subCategoryDTOs = new ArrayList<>();
        for (Category subCategory : category.getSubCategories()) {
            CategoryDTO subCategoryDTO = new CategoryDTO();
            subCategoryDTO.setId(subCategory.getId());
            subCategoryDTO.setName(subCategory.getName());
            subCategoryDTO.setDescription(subCategory.getDescription());
            subCategoryDTO.setIsActive(subCategory.getIsActive());
            subCategoryDTO.setParentCategoryId(category.getId());
            subCategoryDTO.setParentCategoryName(category.getName());
            subCategoryDTO.setProductCount(subCategory.getProducts().size());
            
            subCategoryDTOs.add(subCategoryDTO);
        }
        dto.setSubCategories(subCategoryDTOs);
        
        dto.setProductCount(category.getProducts().size());
        
        return dto;
    }
    
    private Category convertToEntity(CategoryDTO dto) {
        Category category = new Category();
        updateCategoryFromDTO(category, dto);
        return category;
    }
    
    private void updateCategoryFromDTO(Category category, CategoryDTO dto) {
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        
        if (dto.getParentCategoryId() != null) {
            categoryRepository.findById(dto.getParentCategoryId())
                    .ifPresent(category::setParentCategory);
        } else {
            category.setParentCategory(null);
        }
        
        category.setIsActive(dto.getIsActive());
    }
}