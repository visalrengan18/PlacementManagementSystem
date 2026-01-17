package com.jobswipe.dto.network;

import com.jobswipe.domain.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSummaryDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String title; // For seekers: job title, For companies: industry
    private String location;
    private Boolean isFollowing;
    private Boolean isConnected;
    private String connectionStatus; // PENDING, ACCEPTED, or null
}
