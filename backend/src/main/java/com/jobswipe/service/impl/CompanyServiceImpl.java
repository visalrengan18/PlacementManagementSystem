package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.CompanyProfile;
import com.jobswipe.domain.entity.JobPost;
import com.jobswipe.domain.entity.JobStatus;
import com.jobswipe.domain.entity.SeekerProfile;
import com.jobswipe.domain.repository.ApplicationRepository;
import com.jobswipe.domain.repository.CompanyProfileRepository;
import com.jobswipe.domain.repository.JobPostRepository;
import com.jobswipe.domain.repository.SeekerProfileRepository;
import com.jobswipe.dto.job.JobPostDto;
import com.jobswipe.dto.job.JobWithStatusDto;
import com.jobswipe.dto.profile.CompanyProfileDto;
import com.jobswipe.exception.ApiException;
import com.jobswipe.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyProfileRepository companyRepository;
    private final JobPostRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SeekerProfileRepository seekerRepository;

    @Override
    public Page<CompanyProfileDto> searchCompanies(String query, Pageable pageable) {
        if (query == null || query.isBlank()) {
            return companyRepository.findAll(pageable).map(this::toCompanyProfileDto);
        }
        return companyRepository.findByUser_NameContainingIgnoreCase(query, pageable)
                .map(this::toCompanyProfileDto);
    }

    @Override
    public CompanyProfileDto getCompany(Long companyId) {
        return companyRepository.findById(companyId)
                .map(this::toCompanyProfileDto)
                .orElseThrow(() -> new ApiException("Company not found", HttpStatus.NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobWithStatusDto> getCompanyJobs(Long userId, Long companyId, Pageable pageable) {
        CompanyProfile company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ApiException("Company not found", HttpStatus.NOT_FOUND));

        SeekerProfile seeker = seekerRepository.findByUserId(userId).orElse(null);

        return jobRepository.findByCompanyAndStatus(company, JobStatus.OPEN, pageable)
                .map(job -> {
                    var appStatus = seeker != null
                            ? applicationRepository.findBySeekerAndJob(seeker, job)
                            : java.util.Optional.<com.jobswipe.domain.entity.Application>empty();

                    return JobWithStatusDto.builder()
                            .job(toJobPostDto(job))
                            .applicationStatus(
                                    appStatus.map(com.jobswipe.domain.entity.Application::getStatus).orElse(null))
                            .applicationId(appStatus.map(com.jobswipe.domain.entity.Application::getId).orElse(null))
                            .build();
                });
    }

    private CompanyProfileDto toCompanyProfileDto(CompanyProfile c) {
        return CompanyProfileDto.builder()
                .id(c.getId())
                .userId(c.getUser().getId())
                .name(c.getUser().getName())
                .description(c.getDescription())
                .location(c.getLocation())
                .industry(c.getIndustry())
                .website(c.getWebsite())
                .size(c.getSize())
                .build();
    }

    private JobPostDto toJobPostDto(JobPost job) {
        return JobPostDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .location(job.getLocation())
                .type(job.getType())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .skills(job.getSkills())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .company(toCompanyProfileDto(job.getCompany()))
                .build();
    }
}
