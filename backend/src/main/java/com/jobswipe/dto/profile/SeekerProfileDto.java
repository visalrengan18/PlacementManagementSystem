package com.jobswipe.dto.profile;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class SeekerProfileDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String title;
    private String location;
    private String phone;
    private String bio;
    private String experience;
    private String education;
    private List<String> skills;
    private String resumeUrl;
    private String linkedin;
    private String github;
}
