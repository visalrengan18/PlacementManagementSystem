package com.jobswipe.dto.swipe;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SwipeResponse {
    private boolean success;
    private boolean isMatch;
    private String message;
}
