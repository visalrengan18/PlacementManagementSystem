package com.jobswipe.dto.swipe;

import lombok.Data;

@Data
public class SwipeRequest {
    private Long jobId;
    private Long applicationId;
    private SwipeDirection direction;

    public enum SwipeDirection {
        LEFT,
        RIGHT
    }
}
