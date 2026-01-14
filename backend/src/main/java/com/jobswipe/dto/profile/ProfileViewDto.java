package com.jobswipe.dto.profile;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProfileViewDto {
    private String companyName;
    private String jobTitle;
    private String companyLogo; // Using first char of name as logo for now
    private LocalDateTime viewedAt;
    private Long jobId;
}
