package com.climbing.store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.climbing.store.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByIsActiveTrue();
    List<Category> findByParentCategoryIsNull();
    List<Category> findByParentCategoryId(Integer parentId);
}