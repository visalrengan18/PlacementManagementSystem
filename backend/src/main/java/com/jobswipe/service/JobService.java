package com.jobswipe.service;

import com.jobswipe.dto.job.JobPostDto;
import com.jobswipe.dto.job.CreateJobRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface JobService {

    Page<JobPostDto> getAvailableJobsForSeeker(Long userId, Pageable pageable);

    JobPostDto getJobById(Long jobId);

    JobPostDto createJob(Long userId, CreateJobRequest request);

    JobPostDto updateJob(Long userId, Long jobId, CreateJobRequest request);

    void deleteJob(Long userId, Long jobId);

    List<JobPostDto> getCompanyJobs(Long userId);

    JobPostDto closeJob(Long userId, Long jobId);
}
