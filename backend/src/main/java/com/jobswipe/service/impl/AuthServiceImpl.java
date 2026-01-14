package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.*;
import com.jobswipe.domain.repository.*;
import com.jobswipe.dto.auth.*;
import com.jobswipe.exception.ApiException;
import com.jobswipe.security.JwtTokenProvider;
import com.jobswipe.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email already registered", HttpStatus.BAD_REQUEST);
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        log.info("REGISTER - Email: {}, Raw password length: {}, Encoded: {}",
                request.getEmail(), request.getPassword().length(), encodedPassword);

        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .role(request.getRole())
                .build();

        user = userRepository.save(user);
        log.info("REGISTER - User saved with ID: {}", user.getId());

        // Create profile based on role
        if (request.getRole() == Role.SEEKER) {
            SeekerProfile profile = SeekerProfile.builder().user(user).build();
            seekerProfileRepository.save(profile);
        } else {
            CompanyProfile profile = CompanyProfile.builder().user(user).build();
            companyProfileRepository.save(profile);
        }

        String token = jwtTokenProvider.generateToken(user);
        return buildAuthResponse(user, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("LOGIN ATTEMPT - Email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("LOGIN FAILED - User not found: {}", request.getEmail());
                    return new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
                });

        log.info("LOGIN - User found. ID: {}, Stored password hash: {}", user.getId(), user.getPassword());
        log.info("LOGIN - Raw password provided: '{}' (length: {})", request.getPassword(),
                request.getPassword().length());

        // Test: Re-encode the same password to show different hash is expected
        String testEncode = passwordEncoder.encode(request.getPassword());
        log.info("LOGIN - TEST: Re-encoded same password produces different hash: {}", testEncode);
        log.info("LOGIN - TEST: matches() with re-encoded hash: {}",
                passwordEncoder.matches(request.getPassword(), testEncode));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        log.info("LOGIN - Password matches stored hash: {}", passwordMatches);

        if (!passwordMatches) {
            log.warn("LOGIN FAILED - Password mismatch for user: {}", request.getEmail());
            throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        log.info("LOGIN SUCCESS - User: {}", request.getEmail());
        String token = jwtTokenProvider.generateToken(user);
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole())
                        .build())
                .build();
    }
}
