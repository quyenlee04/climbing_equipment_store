package com.climbing.store.security;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.climbing.store.model.UserAddress;
import com.climbing.store.repository.AddressRepository;
import com.climbing.store.repository.UserAddressRepository;
import com.climbing.store.security.services.UserDetailsImpl;

@Component("userSecurity")
public class UserSecurity {

    @Autowired
    private AddressRepository addressRepository;

    public boolean isUserSelf(Integer userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId().equals(userId);
    }

    @Autowired
    private UserAddressRepository userAddressRepository;

    public boolean isAddressOwner(Integer addressId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<UserAddress> addressOpt = userAddressRepository.findById(addressId);
        if (addressOpt.isPresent()) {
            return addressOpt.get().getUserId().equals(userDetails.getId());
        }
        return false;
    }
}