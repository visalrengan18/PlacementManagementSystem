package com.jobswipe.dto.job;

import com.jobswipe.domain.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class CreateJobRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String location;
    private JobType type;
    private Integer salaryMin;
    private Integer salaryMax;
    private String description;
    private String requirements;
    private List<String> skills;
}
