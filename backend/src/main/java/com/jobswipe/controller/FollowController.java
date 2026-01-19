package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.network.UserSummaryDto;
import com.jobswipe.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> follow(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }
        followService.follow(user.getId(), userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> unfollow(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }
        followService.unfollow(user.getId(), userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/followers")
    public ResponseEntity<?> getFollowers(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }
        return ResponseEntity.ok(followService.getFollowers(user.getId()));
    }

    @GetMapping("/following")
    public ResponseEntity<?> getFollowing(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }
        return ResponseEntity.ok(followService.getFollowing(user.getId()));
    }

    @GetMapping("/check/{userId}")
    public ResponseEntity<?> checkFollowing(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }
        boolean isFollowing = followService.isFollowing(user.getId(), userId);
        return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }
        return ResponseEntity.ok(Map.of(
                "followers", followService.getFollowersCount(user.getId()),
                "following", followService.getFollowingCount(user.getId())));
    }
}
