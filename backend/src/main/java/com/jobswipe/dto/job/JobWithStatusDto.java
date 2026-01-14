package com.jobswipe.dto.job;

import com.jobswipe.domain.entity.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobWithStatusDto {
    private JobPostDto job;
    private ApplicationStatus applicationStatus;
    private Long applicationId;
}
