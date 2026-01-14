package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.job.*;
import com.jobswipe.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping("/swipe")
    public ResponseEntity<Page<JobPostDto>> getJobsForSwipe(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(jobService.getAvailableJobsForSeeker(user.getId(), pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<JobPostDto> createJob(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateJobRequest request) {
        return ResponseEntity.ok(jobService.createJob(user.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPostDto> updateJob(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody CreateJobRequest request) {
        return ResponseEntity.ok(jobService.updateJob(user.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        jobService.deleteJob(user.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/company")
    public ResponseEntity<List<JobPostDto>> getCompanyJobs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.getCompanyJobs(user.getId()));
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<JobPostDto> closeJob(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(jobService.closeJob(user.getId(), id));
    }
}
