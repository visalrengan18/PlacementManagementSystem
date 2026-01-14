package com.jobswipe.dto.auth;

import com.jobswipe.domain.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data
    @Builder
    public static class UserDto {
        private Long id;
        private String email;
        private String name;
        private Role role;
    }
}
