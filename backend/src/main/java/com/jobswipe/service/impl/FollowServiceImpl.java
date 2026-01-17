package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.*;
import com.jobswipe.domain.repository.*;
import com.jobswipe.dto.network.UserSummaryDto;
import com.jobswipe.exception.ApiException;
import com.jobswipe.service.FollowService;
import com.jobswipe.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void follow(Long userId, Long targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new ApiException("Cannot follow yourself", HttpStatus.BAD_REQUEST);
        }

        User follower = getUser(userId);
        User following = getUser(targetUserId);

        if (followRepository.existsByFollowerAndFollowing(follower, following)) {
            throw new ApiException("Already following this user", HttpStatus.BAD_REQUEST);
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();

        followRepository.save(follow);

        // Notify the user being followed
        notificationService.createNotification(
                targetUserId,
                NotificationType.FOLLOW,
                "New Follower",
                follower.getName() + " started following you",
                userId);
    }

    @Override
    @Transactional
    public void unfollow(Long userId, Long targetUserId) {
        User follower = getUser(userId);
        User following = getUser(targetUserId);

        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new ApiException("Not following this user", HttpStatus.BAD_REQUEST));

        followRepository.delete(follow);
    }

    @Override
    public List<UserSummaryDto> getFollowers(Long userId) {
        return followRepository.findFollowersByUserId(userId).stream()
                .map(user -> toUserSummary(user, userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<UserSummaryDto> getFollowing(Long userId) {
        return followRepository.findFollowingByUserId(userId).stream()
                .map(user -> toUserSummary(user, userId))
                .collect(Collectors.toList());
    }

    @Override
    public boolean isFollowing(Long userId, Long targetUserId) {
        User follower = userRepository.findById(userId).orElse(null);
        User following = userRepository.findById(targetUserId).orElse(null);
        if (follower == null || following == null)
            return false;
        return followRepository.existsByFollowerAndFollowing(follower, following);
    }

    @Override
    public long getFollowersCount(Long userId) {
        return followRepository.countByFollowingId(userId);
    }

    @Override
    public long getFollowingCount(Long userId) {
        return followRepository.countByFollowerId(userId);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    private UserSummaryDto toUserSummary(User user, Long currentUserId) {
        String title = null;
        String location = null;

        if (user.getRole() == Role.SEEKER) {
            seekerProfileRepository.findByUserId(user.getId()).ifPresent(profile -> {
                // Can't assign to local variables in lambda, so we'll handle this differently
            });
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

        return UserSummaryDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .title(title)
                .location(location)
                .isFollowing(isFollowing(currentUserId, user.getId()))
                .build();
    }
}
