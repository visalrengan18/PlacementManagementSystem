package com.jobswipe.service;

import com.jobswipe.dto.swipe.SwipeRequest;
import com.jobswipe.dto.swipe.SwipeResponse;
import com.jobswipe.dto.application.ApplicationDto;
import com.jobswipe.dto.profile.SeekerProfileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SwipeService {

    SwipeResponse swipeJob(Long userId, SwipeRequest request);

    SwipeResponse swipeApplicant(Long userId, SwipeRequest request);

    Page<ApplicationDto> getSeekerApplications(Long userId, Pageable pageable);

    Page<SeekerProfileDto> getJobApplicants(Long userId, Long jobId, Pageable pageable);
}
