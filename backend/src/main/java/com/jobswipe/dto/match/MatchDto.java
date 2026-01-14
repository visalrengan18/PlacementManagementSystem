package com.jobswipe.dto.match;

import com.jobswipe.dto.job.JobPostDto;
import com.jobswipe.dto.profile.SeekerProfileDto;
import com.jobswipe.dto.profile.CompanyProfileDto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MatchDto {
    private Long id;
    private JobPostDto job;
    private SeekerProfileDto seeker;
    private CompanyProfileDto company;
    private LocalDateTime matchedAt;
    private Boolean contacted;
}
