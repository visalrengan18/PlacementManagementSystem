package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.swipe.*;
import com.jobswipe.dto.application.ApplicationDto;
import com.jobswipe.dto.profile.SeekerProfileDto;
import com.jobswipe.service.SwipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SwipeController {

    private final SwipeService swipeService;

    @PostMapping("/swipes/job")
    public ResponseEntity<SwipeResponse> swipeJob(
            @AuthenticationPrincipal User user,
            @RequestBody SwipeRequest request) {
        return ResponseEntity.ok(swipeService.swipeJob(user.getId(), request));
    }

    @PostMapping("/swipes/applicant")
    public ResponseEntity<SwipeResponse> swipeApplicant(
            @AuthenticationPrincipal User user,
            @RequestBody SwipeRequest request) {
        return ResponseEntity.ok(swipeService.swipeApplicant(user.getId(), request));
    }

    @GetMapping("/applications/seeker")
    public ResponseEntity<Page<ApplicationDto>> getSeekerApplications(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return ResponseEntity.ok(swipeService.getSeekerApplications(user.getId(), pageable));
    }

    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<Page<SeekerProfileDto>> getJobApplicants(
            @AuthenticationPrincipal User user,
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(swipeService.getJobApplicants(user.getId(), jobId, pageable));
    }

    @GetMapping("/applications/views")
    public ResponseEntity<Page<com.jobswipe.dto.profile.ProfileViewDto>> getProfileViews(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(swipeService.getProfileViews(user.getId(), pageable));
    }
}
