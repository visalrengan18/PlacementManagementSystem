package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.*;
import com.jobswipe.domain.repository.*;
import com.jobswipe.dto.profile.*;
import com.jobswipe.exception.ApiException;
import com.jobswipe.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;

    @Override
    public SeekerProfileDto getSeekerProfile(Long userId) {
        User user = getUser(userId);
        SeekerProfile profile = seekerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));
        return toSeekerDto(profile);
    }

    @Override
    @Transactional
    public SeekerProfileDto updateSeekerProfile(Long userId, SeekerProfileDto dto) {
        User user = getUser(userId);
        SeekerProfile profile = seekerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));

        profile.setTitle(dto.getTitle());
        profile.setLocation(dto.getLocation());
        profile.setPhone(dto.getPhone());
        profile.setBio(dto.getBio());
        profile.setExperience(dto.getExperience());
        profile.setEducation(dto.getEducation());
        profile.setSkills(dto.getSkills());
        profile.setResumeUrl(dto.getResumeUrl());
        profile.setLinkedin(dto.getLinkedin());
        profile.setGithub(dto.getGithub());

        return toSeekerDto(seekerProfileRepository.save(profile));
    }

    @Override
    public CompanyProfileDto getCompanyProfile(Long userId) {
        User user = getUser(userId);
        CompanyProfile profile = companyProfileRepository.findByUser(user)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));
        return toCompanyDto(profile);
    }

    @Override
    @Transactional
    public CompanyProfileDto updateCompanyProfile(Long userId, CompanyProfileDto dto) {
        User user = getUser(userId);
        CompanyProfile profile = companyProfileRepository.findByUser(user)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));

        profile.setIndustry(dto.getIndustry());
        profile.setLocation(dto.getLocation());
        profile.setSize(dto.getSize());
        profile.setWebsite(dto.getWebsite());
        profile.setDescription(dto.getDescription());
        profile.setFounded(dto.getFounded());
        profile.setLogoUrl(dto.getLogoUrl());

        return toCompanyDto(companyProfileRepository.save(profile));
    }

    @Override
    public SeekerProfileDto getPublicSeekerProfile(Long seekerId) {
        SeekerProfile profile = seekerProfileRepository.findById(seekerId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));
        return toSeekerDto(profile);
    }

    @Override
    public CompanyProfileDto getPublicCompanyProfile(Long companyId) {
        CompanyProfile profile = companyProfileRepository.findById(companyId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));
        return toCompanyDto(profile);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    private SeekerProfileDto toSeekerDto(SeekerProfile p) {
        return SeekerProfileDto.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .name(p.getUser().getName())
                .email(p.getUser().getEmail())
                .title(p.getTitle())
                .location(p.getLocation())
                .phone(p.getPhone())
                .bio(p.getBio())
                .experience(p.getExperience())
                .education(p.getEducation())
                .skills(p.getSkills())
                .resumeUrl(p.getResumeUrl())
                .linkedin(p.getLinkedin())
                .github(p.getGithub())
                .build();
    }

    private CompanyProfileDto toCompanyDto(CompanyProfile p) {
        return CompanyProfileDto.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .name(p.getUser().getName())
                .email(p.getUser().getEmail())
                .industry(p.getIndustry())
                .location(p.getLocation())
                .size(p.getSize())
                .website(p.getWebsite())
                .description(p.getDescription())
                .founded(p.getFounded())
                .logoUrl(p.getLogoUrl())
                .build();
    }
}
