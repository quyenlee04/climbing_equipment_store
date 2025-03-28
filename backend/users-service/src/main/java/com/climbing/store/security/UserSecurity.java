package com.climbing.store.security;


import com.climbing.store.model.Address;
import com.climbing.store.repository.AddressRepository;
import com.climbing.store.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("userSecurity")
public class UserSecurity {

    @Autowired
    private AddressRepository addressRepository;

    public boolean isUserSelf(Integer userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId().equals(userId);
    }

    public boolean isAddressOwner(Integer addressId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<Address> addressOpt = addressRepository.findById(addressId);
        if (addressOpt.isPresent()) {
            return addressOpt.get().getUser().getId().equals(userDetails.getId());
        }
        return false;
    }
}