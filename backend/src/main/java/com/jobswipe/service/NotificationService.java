package com.jobswipe.service;

import com.jobswipe.domain.entity.NotificationType;
import com.jobswipe.dto.notification.NotificationDto;
import java.util.List;

public interface NotificationService {

    List<NotificationDto> getNotifications(Long userId, int limit);

    long getUnreadCount(Long userId);

    void markAsRead(Long userId, Long notificationId);

    void markAllAsRead(Long userId);

    void createNotification(Long userId, NotificationType type, String title, String message, Long relatedId);
}
