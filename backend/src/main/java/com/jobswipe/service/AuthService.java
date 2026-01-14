package com.jobswipe.service;

import com.jobswipe.dto.auth.AuthResponse;
import com.jobswipe.dto.auth.LoginRequest;
import com.jobswipe.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
