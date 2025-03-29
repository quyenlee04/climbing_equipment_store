package com.climbing.store.controller;



import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.climbing.store.dto.request.LoginRequest;
import com.climbing.store.dto.request.SignupRequest;
import com.climbing.store.dto.response.JwtResponse;
import com.climbing.store.dto.response.MessageResponse;
import com.climbing.store.model.ERole;
import com.climbing.store.model.Role;
import com.climbing.store.model.User;
import com.climbing.store.repository.RoleRepository;
import com.climbing.store.repository.UserRepository;
import com.climbing.store.security.jwt.JwtUtils;
import com.climbing.store.security.services.UserDetailsImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                roles));
    }

  

@PostMapping("/signup")
public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
    // Check if email exists
    if (userRepository.existsByEmail(signupRequest.getEmail())) {
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
    }
    
    // Create new user
    User user = new User();
    user.setEmail(signupRequest.getEmail());
    
    // Set username - using email as username if not provided
    if (signupRequest.getUsername() != null && !signupRequest.getUsername().trim().isEmpty()) {
        user.setUsername(signupRequest.getUsername());
    } else {
        // Use email as username or generate one from first and last name
        user.setUsername(signupRequest.getEmail());
    }
    
    user.setPassword(encoder.encode(signupRequest.getPassword()));
    user.setFirstName(signupRequest.getFirstName());
    user.setLastName(signupRequest.getLastName());
    user.setPhoneNumber(signupRequest.getPhoneNumber());
    user.setIsActive(true);
    user.setCreatedAt(LocalDateTime.now());
    
    // Set role
    Set<String> strRoles = signupRequest.getRoles();
    Set<Role> roles = new HashSet<>();
    AtomicReference<Role> defaultRoleRef = new AtomicReference<>();
    
    if (strRoles == null || strRoles.isEmpty()) {
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        defaultRoleRef.set(userRole);
    } else {
        strRoles.forEach(role -> {
            switch (role) {
                case "admin":
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
                    if (defaultRoleRef.get() == null) defaultRoleRef.set(adminRole);
                    break;
                default:
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                    if (defaultRoleRef.get() == null) defaultRoleRef.set(userRole);
            }
        });
    }
    
    // Set both the roles collection and the direct role_id
    user.setRoles(roles);
    user.setRole(defaultRoleRef.get()); // This sets the direct role_id column
    
    userRepository.save(user);
    
    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
}


}