package com.jobswipe.dto.profile;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyProfileDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String industry;
    private String location;
    private String size;
    private String website;
    private String description;
    private String founded;
    private String logoUrl;
}
