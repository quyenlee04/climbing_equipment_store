package com.climbing.store.repository;

import com.climbing.store.model.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Integer> {
    List<UserAddress> findByUserId(Integer userId);
    UserAddress findByUserIdAndIsDefaultTrue(Integer userId);
}