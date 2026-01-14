package com.jobswipe.controller;

import com.jobswipe.dto.chat.MessageDto;
import com.jobswipe.dto.chat.SendMessageRequest;
import com.jobswipe.security.JwtTokenProvider;
import com.jobswipe.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String token = (String) headerAccessor.getSessionAttributes().get("token");
            if (token == null) {
                log.warn("No token in WebSocket session");
                return;
            }

            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            MessageDto message = chatService.sendMessage(userId, request.getMatchId(), request.getContent());

            // Broadcast to the chat topic
            messagingTemplate.convertAndSend("/topic/chat." + request.getMatchId(), message);
            log.info("Message sent to match {}", request.getMatchId());
        } catch (Exception e) {
            log.error("Error sending message", e);
        }
    }
}
