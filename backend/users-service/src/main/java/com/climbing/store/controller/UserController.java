package com.climbing.store.controller;

import com.climbing.store.dto.AddressDTO;
import com.climbing.store.dto.UserDTO;
import com.climbing.store.dto.response.MessageResponse;
import com.climbing.store.security.services.UserDetailsImpl;
import com.climbing.store.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserSelf(#id)")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        UserDTO user = userService.getUserById(userDetails.getId());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserSelf(#id)")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Integer id, @Valid @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserSelf(#id)")
    public ResponseEntity<?> deactivateUser(@PathVariable Integer id) {
        boolean result = userService.deactivateUser(id);
        if (result) {
            return ResponseEntity.ok(new MessageResponse("User deactivated successfully"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to deactivate user"));
        }
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateUser(@PathVariable Integer id) {
        boolean result = userService.activateUser(id);
        if (result) {
            return ResponseEntity.ok(new MessageResponse("User activated successfully"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to activate user"));
        }
    }

    @PutMapping("/{id}/change-password")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserSelf(#id)")
    public ResponseEntity<?> changePassword(
            @PathVariable Integer id,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        boolean result = userService.changePassword(id, oldPassword, newPassword);
        if (result) {
            return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to change password"));
        }
    }

    // Address endpoints
    @GetMapping("/{userId}/addresses")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserSelf(#userId)")
    public ResponseEntity<List<AddressDTO>> getUserAddresses(@PathVariable Integer userId) {
        List<AddressDTO> addresses = userService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/addresses/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isAddressOwner(#id)")
    public ResponseEntity<AddressDTO> getAddressById(@PathVariable Integer id) {
        AddressDTO address = userService.getAddressById(id);
        return ResponseEntity.ok(address);
    }

    @PostMapping("/{userId}/addresses")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserSelf(#userId)")
    public ResponseEntity<AddressDTO> createAddress(
            @PathVariable Integer userId,
            @Valid @RequestBody AddressDTO addressDTO) {
        addressDTO.setUserId(userId);
        AddressDTO createdAddress = userService.createAddress(addressDTO);
        return ResponseEntity.ok(createdAddress);
    }

    @PutMapping("/addresses/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isAddressOwner(#id)")
    public ResponseEntity<AddressDTO> updateAddress(
            @PathVariable Integer id,
            @Valid @RequestBody AddressDTO addressDTO) {
        AddressDTO updatedAddress = userService.updateAddress(id, addressDTO);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/addresses/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isAddressOwner(#id)")
    public ResponseEntity<?> deleteAddress(@PathVariable Integer id) {
        boolean result = userService.deleteAddress(id);
        if (result) {
            return ResponseEntity.ok(new MessageResponse("Address deleted successfully"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to delete address"));
        }
    }
}