package com.jobswipe.service;

import com.jobswipe.dto.profile.CompanyProfileDto;
import com.jobswipe.dto.job.JobWithStatusDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CompanyService {
    Page<CompanyProfileDto> searchCompanies(String query, Pageable pageable);

    CompanyProfileDto getCompany(Long companyId);

    Page<JobWithStatusDto> getCompanyJobs(Long userId, Long companyId, Pageable pageable);
}
