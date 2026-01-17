package com.jobswipe.config;

import com.jobswipe.dto.chat.UserPresenceDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    // Map<SessionId, UserId>
    private final Map<String, Long> activeSessions = new ConcurrentHashMap<>();

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = headerAccessor.getUser();

        if (user != null) {
            String sessionId = headerAccessor.getSessionId();
            try {
                // If the principal name is not a number (e.g. might be a username if configured
                // differently), this might fail.
                // But our Interceptor sets it to userId.
                Long userId = Long.valueOf(user.getName());

                boolean wasOnline = isUserOnline(userId);
                activeSessions.put(sessionId, userId);

                if (!wasOnline) {
                    log.info("User connected: {}", userId);
                    broadcastPresence(userId, true);
                }
            } catch (NumberFormatException e) {
                log.warn("Invalid user ID format in principal: {}", user.getName());
            }
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        Long userId = activeSessions.remove(sessionId);

        if (userId != null) {
            if (!isUserOnline(userId)) {
                log.info("User disconnected: {}", userId);
                broadcastPresence(userId, false);
            }
        }
    }

    private boolean isUserOnline(Long userId) {
        return activeSessions.containsValue(userId);
    }

    private void broadcastPresence(Long userId, boolean online) {
        UserPresenceDto presence = UserPresenceDto.builder()
                .userId(userId)
                .online(online)
                .build();

        messagingTemplate.convertAndSend("/topic/presence", presence);
    }

    public Set<Long> getOnlineUsers() {
        return activeSessions.values().stream().collect(Collectors.toSet());
    }
}
