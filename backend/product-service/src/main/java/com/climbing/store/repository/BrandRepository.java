package com.climbing.store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.climbing.store.model.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    List<Brand> findByIsActiveTrue();
    List<Brand> findByNameContainingIgnoreCase(String name);
}