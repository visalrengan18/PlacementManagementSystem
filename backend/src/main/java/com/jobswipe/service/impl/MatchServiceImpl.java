package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.*;
import com.jobswipe.domain.repository.*;
import com.jobswipe.dto.match.MatchDto;
import com.jobswipe.dto.job.JobPostDto;
import com.jobswipe.dto.profile.*;
import com.jobswipe.exception.ApiException;
import com.jobswipe.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;

    @Override
    public List<MatchDto> getSeekerMatches(Long userId) {
        SeekerProfile seeker = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));

        return matchRepository.findBySeekerIdOrderByMatchedAtDesc(seeker.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<MatchDto> getCompanyMatches(Long userId) {
        CompanyProfile company = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));

        return matchRepository.findByCompanyIdOrderByMatchedAtDesc(company.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private MatchDto toDto(Match m) {
        Application app = m.getApplication();
        SeekerProfile seeker = app.getSeeker();
        JobPost job = app.getJob();
        CompanyProfile company = job.getCompany();

        return MatchDto.builder()
                .id(m.getId())
                .matchedAt(m.getMatchedAt())
                .contacted(m.getContacted())
                .job(JobPostDto.builder()
                        .id(job.getId())
                        .title(job.getTitle())
                        .build())
                .seeker(SeekerProfileDto.builder()
                        .id(seeker.getId())
                        .name(seeker.getUser().getName())
                        .title(seeker.getTitle())
                        .build())
                .company(CompanyProfileDto.builder()
                        .id(company.getId())
                        .name(company.getUser().getName())
                        .industry(company.getIndustry())
                        .location(company.getLocation())
                        .build())
                .build();
    }
}
