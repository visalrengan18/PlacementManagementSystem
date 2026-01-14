package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.job.JobWithStatusDto;
import com.jobswipe.dto.profile.CompanyProfileDto;
import com.jobswipe.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<Page<CompanyProfileDto>> searchCompanies(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("user.name")); // Sorting mostly works by entity field
        // But here we sort by name. companyRepository.findAll sort by default ID if not
        // specified,
        // to sort by name we need Sort.by properties of the ENTITY not the DTO.
        // Entity matches User.name? No entity has User.
        // Actually sorting by nested property "user.name" works in JPA.
        return ResponseEntity.ok(companyService.searchCompanies(query, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyProfileDto> getCompany(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompany(id));
    }

    @GetMapping("/{id}/jobs")
    public ResponseEntity<Page<JobWithStatusDto>> getCompanyJobs(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(companyService.getCompanyJobs(user.getId(), id, pageable));
    }
}
