package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.*;
import com.jobswipe.domain.repository.*;
import com.jobswipe.dto.network.UserSummaryDto;
import com.jobswipe.service.ConnectionService;
import com.jobswipe.service.FollowService;
import com.jobswipe.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final FollowService followService;
    private final ConnectionService connectionService;

    @Override
    public List<UserSummaryDto> searchUsers(Long currentUserId, String query, String type) {
        List<User> users = new ArrayList<>();

        if (query == null || query.trim().isEmpty()) {
            // Return recent users if no query
            List<User> allUsers = userRepository.findAll();

            if ("seeker".equalsIgnoreCase(type)) {
                users = allUsers.stream()
                        .filter(u -> u.getRole() == Role.SEEKER)
                        .collect(Collectors.toList());
            } else if ("company".equalsIgnoreCase(type)) {
                users = allUsers.stream()
                        .filter(u -> u.getRole() == Role.COMPANY)
                        .collect(Collectors.toList());
            } else {
                users = allUsers;
            }

            users = users.stream()
                    .filter(u -> !u.getId().equals(currentUserId))
                    .limit(20)
                    .collect(Collectors.toList());
        } else {
            if ("seeker".equalsIgnoreCase(type)) {
                users = userRepository.findByRoleAndNameContainingIgnoreCase(Role.SEEKER, query);
            } else if ("company".equalsIgnoreCase(type)) {
                users = userRepository.findByRoleAndNameContainingIgnoreCase(Role.COMPANY, query);
            } else {
                users = userRepository.findByNameContainingIgnoreCase(query);
            }
        }

        return users.stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .map(u -> toUserSummary(u, currentUserId))
                .collect(Collectors.toList());
    }

    private UserSummaryDto toUserSummary(User user, Long currentUserId) {
        String title = null;
        String location = null;

        if (user.getRole() == Role.SEEKER) {
            var profile = seekerProfileRepository.findByUserId(user.getId()).orElse(null);
            if (profile != null) {
                title = profile.getTitle();
                location = profile.getLocation();
            }
        } else if (user.getRole() == Role.COMPANY) {
            var profile = companyProfileRepository.findByUserId(user.getId()).orElse(null);
            if (profile != null) {
                title = profile.getIndustry();
                location = profile.getLocation();
            }
        }

        boolean isFollowing = followService.isFollowing(currentUserId, user.getId());
        boolean isConnected = connectionService.isConnected(currentUserId, user.getId());

        return UserSummaryDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .title(title)
                .location(location)
                .isFollowing(isFollowing)
                .isConnected(isConnected)
                .build();
    }
}
