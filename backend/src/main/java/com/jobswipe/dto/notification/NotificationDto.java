package com.jobswipe.dto.notification;

import com.jobswipe.domain.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    private Long id;
    private NotificationType type;
    private String title;
    private String message;
    private Long relatedId;
    private Boolean read;
    private LocalDateTime createdAt;
}
