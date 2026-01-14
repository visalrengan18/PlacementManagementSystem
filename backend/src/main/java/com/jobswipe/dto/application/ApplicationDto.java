package com.jobswipe.dto.application;

import com.jobswipe.domain.entity.ApplicationStatus;
import com.jobswipe.dto.job.JobPostDto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ApplicationDto {
    private Long id;
    private JobPostDto job;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
