package com.jobswipe.service;

import com.jobswipe.dto.profile.SeekerProfileDto;
import com.jobswipe.dto.profile.CompanyProfileDto;

public interface ProfileService {

    SeekerProfileDto getSeekerProfile(Long userId);

    SeekerProfileDto updateSeekerProfile(Long userId, SeekerProfileDto dto);

    CompanyProfileDto getCompanyProfile(Long userId);

    CompanyProfileDto updateCompanyProfile(Long userId, CompanyProfileDto dto);

    SeekerProfileDto getPublicSeekerProfile(Long seekerId);

    CompanyProfileDto getPublicCompanyProfile(Long companyId);
}
