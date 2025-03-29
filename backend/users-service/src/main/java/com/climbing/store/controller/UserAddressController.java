package com.climbing.store.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.climbing.store.dto.UserAddressDTO;
import com.climbing.store.dto.response.MessageResponse;
import com.climbing.store.service.UserAddressService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/addresses")
public class UserAddressController {

    @Autowired
    private UserAddressService userAddressService;

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserSelf(#userId)")
    public ResponseEntity<List<UserAddressDTO>> getUserAddresses(@PathVariable Integer userId) {
        List<UserAddressDTO> addresses = userAddressService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isAddressOwner(#id)")
    public ResponseEntity<UserAddressDTO> getAddressById(@PathVariable Integer id) {
        UserAddressDTO address = userAddressService.getAddressById(id);
        return ResponseEntity.ok(address);
    }

    @PostMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserSelf(#userId)")
    public ResponseEntity<UserAddressDTO> createAddress(
            @PathVariable Integer userId,
            @Valid @RequestBody UserAddressDTO addressDTO) {
        addressDTO.setUserId(userId);
        UserAddressDTO createdAddress = userAddressService.createAddress(addressDTO);
        return ResponseEntity.ok(createdAddress);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isAddressOwner(#id)")
    public ResponseEntity<UserAddressDTO> updateAddress(
            @PathVariable Integer id,
            @Valid @RequestBody UserAddressDTO addressDTO) {
        UserAddressDTO updatedAddress = userAddressService.updateAddress(id, addressDTO);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isAddressOwner(#id)")
    public ResponseEntity<?> deleteAddress(@PathVariable Integer id) {
        boolean result = userAddressService.deleteAddress(id);
        if (result) {
            return ResponseEntity.ok(new MessageResponse("Address deleted successfully"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to delete address"));
        }
    }
}