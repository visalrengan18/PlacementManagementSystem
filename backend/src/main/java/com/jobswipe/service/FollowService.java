package com.jobswipe.service;

import com.jobswipe.dto.network.UserSummaryDto;
import java.util.List;

public interface FollowService {

    void follow(Long userId, Long targetUserId);

    void unfollow(Long userId, Long targetUserId);

    List<UserSummaryDto> getFollowers(Long userId);

    List<UserSummaryDto> getFollowing(Long userId);

    boolean isFollowing(Long userId, Long targetUserId);

    long getFollowersCount(Long userId);

    long getFollowingCount(Long userId);
}
