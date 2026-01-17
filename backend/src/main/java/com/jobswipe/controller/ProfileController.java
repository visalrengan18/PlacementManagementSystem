package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.profile.*;
import com.jobswipe.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/seeker")
    public ResponseEntity<SeekerProfileDto> getSeekerProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profileService.getSeekerProfile(user.getId()));
    }

    @PutMapping("/seeker")
    public ResponseEntity<SeekerProfileDto> updateSeekerProfile(
            @AuthenticationPrincipal User user,
            @RequestBody SeekerProfileDto dto) {
        return ResponseEntity.ok(profileService.updateSeekerProfile(user.getId(), dto));
    }

    @GetMapping("/company")
    public ResponseEntity<CompanyProfileDto> getCompanyProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profileService.getCompanyProfile(user.getId()));
    }

    @PutMapping("/company")
    public ResponseEntity<CompanyProfileDto> updateCompanyProfile(
            @AuthenticationPrincipal User user,
            @RequestBody CompanyProfileDto dto) {
        return ResponseEntity.ok(profileService.updateCompanyProfile(user.getId(), dto));
    }

    @GetMapping("/seeker/{id}")
    public ResponseEntity<SeekerProfileDto> getPublicSeekerProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getPublicSeekerProfile(id));
    }

    @GetMapping("/company/{id}")
    public ResponseEntity<CompanyProfileDto> getPublicCompanyProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getPublicCompanyProfile(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Object> getPublicProfileByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getPublicProfileByUserId(userId));
    }
}
