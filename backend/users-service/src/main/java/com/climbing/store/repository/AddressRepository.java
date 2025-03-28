package com.climbing.store.repository;



import com.climbing.store.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByUserId(Integer userId);
    Address findByUserIdAndIsDefaultTrue(Integer userId);
}