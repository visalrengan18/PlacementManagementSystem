package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.*;
import com.jobswipe.domain.repository.*;
import com.jobswipe.dto.job.*;
import com.jobswipe.dto.profile.CompanyProfileDto;
import com.jobswipe.exception.ApiException;
import com.jobswipe.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobPostRepository jobPostRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final UserRepository userRepository;

    @Override
    public Page<JobPostDto> getAvailableJobsForSeeker(Long userId, Pageable pageable) {
        SeekerProfile seeker = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));

        Page<JobPost> jobs = jobPostRepository.findAvailableJobsForSeeker(seeker.getId(), JobStatus.OPEN, pageable);
        return jobs.map(this::toDto);
    }

    @Override
    public JobPostDto getJobById(Long jobId) {
        JobPost job = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new ApiException("Job not found", HttpStatus.NOT_FOUND));
        return toDto(job);
    }

    @Override
    @Transactional
    public JobPostDto createJob(Long userId, CreateJobRequest request) {
        CompanyProfile company = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Company profile not found", HttpStatus.NOT_FOUND));

        JobPost job = JobPost.builder()
                .company(company)
                .title(request.getTitle())
                .location(request.getLocation())
                .type(request.getType() != null ? request.getType() : JobType.FULL_TIME)
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .skills(request.getSkills() != null ? request.getSkills() : List.of())
                .build();

        return toDto(jobPostRepository.save(job));
    }

    @Override
    @Transactional
    public JobPostDto updateJob(Long userId, Long jobId, CreateJobRequest request) {
        JobPost job = getJobForCompany(userId, jobId);

        job.setTitle(request.getTitle());
        job.setLocation(request.getLocation());
        job.setType(request.getType());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setSkills(request.getSkills() != null ? request.getSkills() : List.of());

        return toDto(jobPostRepository.save(job));
    }

    @Override
    @Transactional
    public void deleteJob(Long userId, Long jobId) {
        JobPost job = getJobForCompany(userId, jobId);
        jobPostRepository.delete(job);
    }

    @Override
    public List<JobPostDto> getCompanyJobs(Long userId) {
        CompanyProfile company = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Company profile not found", HttpStatus.NOT_FOUND));

        return jobPostRepository.findByCompany(company).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public JobPostDto closeJob(Long userId, Long jobId) {
        JobPost job = getJobForCompany(userId, jobId);
        job.close();
        return toDto(jobPostRepository.save(job));
    }

    private JobPost getJobForCompany(Long userId, Long jobId) {
        CompanyProfile company = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Company profile not found", HttpStatus.NOT_FOUND));

        JobPost job = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new ApiException("Job not found", HttpStatus.NOT_FOUND));

        if (!job.getCompany().getId().equals(company.getId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }
        return job;
    }

    private JobPostDto toDto(JobPost j) {
        return JobPostDto.builder()
                .id(j.getId())
                .title(j.getTitle())
                .location(j.getLocation())
                .type(j.getType())
                .salaryMin(j.getSalaryMin())
                .salaryMax(j.getSalaryMax())
                .description(j.getDescription())
                .requirements(j.getRequirements())
                .skills(j.getSkills())
                .status(j.getStatus())
                .createdAt(j.getCreatedAt())
                .company(CompanyProfileDto.builder()
                        .id(j.getCompany().getId())
                        .userId(j.getCompany().getUser().getId())
                        .name(j.getCompany().getUser().getName())
                        .industry(j.getCompany().getIndustry())
                        .location(j.getCompany().getLocation())
                        .logoUrl(j.getCompany().getLogoUrl())
                        .build())
                .build();
    }
}
