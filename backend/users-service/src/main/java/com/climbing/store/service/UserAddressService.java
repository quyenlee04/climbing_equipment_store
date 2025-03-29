package com.climbing.store.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.climbing.store.dto.UserAddressDTO;
import com.climbing.store.exception.ResourceNotFoundException;
import com.climbing.store.model.UserAddress;
import com.climbing.store.repository.UserAddressRepository;
import com.climbing.store.repository.UserRepository;

@Service
public class UserAddressService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAddressRepository userAddressRepository;

    public List<UserAddressDTO> getUserAddresses(Integer userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return userAddressRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserAddressDTO getAddressById(Integer addressId) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));
        return convertToDTO(address);
    }

    @Transactional
    public UserAddressDTO createAddress(UserAddressDTO addressDTO) {
        userRepository.findById(addressDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + addressDTO.getUserId()));

        UserAddress address = convertToEntity(addressDTO);

        // If this is set as default, unset any existing default
        if (Boolean.TRUE.equals(addressDTO.getIsDefault())) {
            UserAddress defaultAddress = userAddressRepository.findByUserIdAndIsDefaultTrue(addressDTO.getUserId());
            if (defaultAddress != null) {
                defaultAddress.setIsDefault(false);
                userAddressRepository.save(defaultAddress);
            }
        }

        UserAddress savedAddress = userAddressRepository.save(address);
        return convertToDTO(savedAddress);
    }

    @Transactional
    public UserAddressDTO updateAddress(Integer id, UserAddressDTO addressDTO) {
        UserAddress address = userAddressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));

        address.setStreetAddress(addressDTO.getStreetAddress());
        address.setCity(addressDTO.getCity());
        address.setState(addressDTO.getState());
        address.setPostalCode(addressDTO.getPostalCode());
        address.setCountry(addressDTO.getCountry());
        address.setAddressType(addressDTO.getAddressType());

        // If this is set as default, unset any existing default
        if (Boolean.TRUE.equals(addressDTO.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            UserAddress defaultAddress = userAddressRepository.findByUserIdAndIsDefaultTrue(address.getUserId());
            if (defaultAddress != null && !defaultAddress.getId().equals(address.getId())) {
                defaultAddress.setIsDefault(false);
                userAddressRepository.save(defaultAddress);
            }
            address.setIsDefault(true);
        }

        UserAddress updatedAddress = userAddressRepository.save(address);
        return convertToDTO(updatedAddress);
    }

    @Transactional
    public boolean deleteAddress(Integer id) {
        if (userAddressRepository.existsById(id)) {
            userAddressRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private UserAddressDTO convertToDTO(UserAddress address) {
        UserAddressDTO dto = new UserAddressDTO();
        dto.setId(address.getId());
        dto.setUserId(address.getUserId());
        dto.setAddressType(address.getAddressType());
        dto.setStreetAddress(address.getStreetAddress());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPostalCode(address.getPostalCode());
        dto.setCountry(address.getCountry());
        dto.setIsDefault(address.getIsDefault());
        return dto;
    }

    private UserAddress convertToEntity(UserAddressDTO dto) {
        UserAddress address = new UserAddress();
        address.setUserId(dto.getUserId());
        address.setAddressType(dto.getAddressType());
        address.setStreetAddress(dto.getStreetAddress());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry());
        address.setIsDefault(dto.getIsDefault());
        return address;
    }
}