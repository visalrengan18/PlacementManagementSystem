package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.*;
import com.jobswipe.domain.repository.*;
import com.jobswipe.dto.swipe.*;
import com.jobswipe.dto.application.ApplicationDto;
import com.jobswipe.dto.job.JobPostDto;
import com.jobswipe.dto.profile.*;
import com.jobswipe.exception.ApiException;
import com.jobswipe.service.SwipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SwipeServiceImpl implements SwipeService {

    private final ApplicationRepository applicationRepository;
    private final JobPostRepository jobPostRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final MatchRepository matchRepository;

    @Override
    @Transactional
    public SwipeResponse swipeJob(Long userId, SwipeRequest request) {
        SeekerProfile seeker = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));

        JobPost job = jobPostRepository.findById(request.getJobId())
                .orElseThrow(() -> new ApiException("Job not found", HttpStatus.NOT_FOUND));

        if (request.getDirection() == SwipeRequest.SwipeDirection.LEFT) {
            return SwipeResponse.builder().success(true).isMatch(false).message("Job skipped").build();
        }

        // Right swipe = Apply
        if (applicationRepository.existsBySeekerAndJob(seeker, job)) {
            return SwipeResponse.builder().success(false).isMatch(false).message("Already applied").build();
        }

        Application application = Application.builder().seeker(seeker).job(job).build();
        applicationRepository.save(application);

        return SwipeResponse.builder().success(true).isMatch(false).message("Application submitted").build();
    }

    @Override
    @Transactional
    public SwipeResponse swipeApplicant(Long userId, SwipeRequest request) {
        CompanyProfile company = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));

        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ApiException("Application not found", HttpStatus.NOT_FOUND));

        if (!application.getJob().getCompany().getId().equals(company.getId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        if (request.getDirection() == SwipeRequest.SwipeDirection.LEFT) {
            application.reject();
            applicationRepository.save(application);
            return SwipeResponse.builder().success(true).isMatch(false).message("Candidate rejected").build();
        }

        // Right swipe = Accept = Match!
        application.accept();
        applicationRepository.save(application);

        Match match = Match.builder().application(application).build();
        matchRepository.save(match);

        return SwipeResponse.builder().success(true).isMatch(true).message("It's a match!").build();
    }

    @Override
    public Page<ApplicationDto> getSeekerApplications(Long userId, Pageable pageable) {
        SeekerProfile seeker = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));

        return applicationRepository.findBySeeker(seeker, pageable).map(this::toApplicationDto);
    }

    @Override
    @Transactional
    public Page<SeekerProfileDto> getJobApplicants(Long userId, Long jobId, Pageable pageable) {
        CompanyProfile company = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));

        JobPost job = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new ApiException("Job not found", HttpStatus.NOT_FOUND));

        if (!job.getCompany().getId().equals(company.getId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        // Get all pending or viewed applications (not rejected/accepted)
        Page<Application> applications = applicationRepository.findPendingOrViewedByJob(job, pageable);

        // Mark PENDING applications as VIEWED when company views them
        applications.getContent().forEach(app -> {
            if (app.getStatus() == ApplicationStatus.PENDING) {
                app.setStatus(ApplicationStatus.VIEWED);
                app.setReviewedAt(java.time.LocalDateTime.now());
                applicationRepository.save(app);
            }
        });

        return applications.map(app -> toSeekerDto(app.getSeeker(), app.getId()));
    }

    @Override
    public Page<ProfileViewDto> getProfileViews(Long userId, Pageable pageable) {
        SeekerProfile seeker = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));

        return applicationRepository.findViewedApplications(seeker, pageable)
                .map(this::toProfileViewDto);
    }

    private ProfileViewDto toProfileViewDto(Application app) {
        String companyName = app.getJob().getCompany().getUser().getName();
        return ProfileViewDto.builder()
                .companyName(companyName)
                .companyLogo(companyName != null && !companyName.isEmpty() ? companyName.substring(0, 1) : "C")
                .jobTitle(app.getJob().getTitle())
                .jobId(app.getJob().getId())
                .viewedAt(app.getReviewedAt() != null ? app.getReviewedAt() : app.getAppliedAt())
                .build();
    }

    private ApplicationDto toApplicationDto(Application a) {
        return ApplicationDto.builder()
                .id(a.getId())
                .status(a.getStatus())
                .appliedAt(a.getAppliedAt())
                .job(JobPostDto.builder()
                        .id(a.getJob().getId())
                        .title(a.getJob().getTitle())
                        .company(CompanyProfileDto.builder()
                                .id(a.getJob().getCompany().getId())
                                .name(a.getJob().getCompany().getUser().getName())
                                .build())
                        .build())
                .build();
    }

    private SeekerProfileDto toSeekerDto(SeekerProfile p, Long applicationId) {
        return SeekerProfileDto.builder()
                .id(applicationId)
                .userId(p.getUser().getId())
                .name(p.getUser().getName())
                .title(p.getTitle())
                .location(p.getLocation())
                .bio(p.getBio())
                .experience(p.getExperience())
                .education(p.getEducation())
                .skills(p.getSkills())
                .build();
    }
}
