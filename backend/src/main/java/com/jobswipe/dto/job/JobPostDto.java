package com.jobswipe.dto.job;

import com.jobswipe.domain.entity.JobStatus;
import com.jobswipe.domain.entity.JobType;
import com.jobswipe.dto.profile.CompanyProfileDto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class JobPostDto {
    private Long id;
    private String title;
    private String location;
    private JobType type;
    private Integer salaryMin;
    private Integer salaryMax;
    private String description;
    private String requirements;
    private List<String> skills;
    private JobStatus status;
    private LocalDateTime createdAt;
    private CompanyProfileDto company;
}
