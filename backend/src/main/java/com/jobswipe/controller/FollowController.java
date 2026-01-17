package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.network.UserSummaryDto;
import com.jobswipe.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{userId}")
    public ResponseEntity<Void> follow(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        followService.follow(user.getId(), userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unfollow(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        followService.unfollow(user.getId(), userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/followers")
    public ResponseEntity<List<UserSummaryDto>> getFollowers(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(followService.getFollowers(user.getId()));
    }

    @GetMapping("/following")
    public ResponseEntity<List<UserSummaryDto>> getFollowing(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(followService.getFollowing(user.getId()));
    }

    @GetMapping("/check/{userId}")
    public ResponseEntity<Map<String, Boolean>> checkFollowing(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        boolean isFollowing = followService.isFollowing(user.getId(), userId);
        return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of(
                "followers", followService.getFollowersCount(user.getId()),
                "following", followService.getFollowingCount(user.getId())));
    }
}
