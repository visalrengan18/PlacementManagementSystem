package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.chat.*;
import com.jobswipe.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<List<ChatRoomDto>> getUserChats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getUserChatRooms(user.getId()));
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<ChatRoomDto> getChatRoom(
            @AuthenticationPrincipal User user,
            @PathVariable Long matchId) {
        return ResponseEntity.ok(chatService.getOrCreateChatRoom(user.getId(), matchId));
    }

    @GetMapping("/{matchId}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(
            @AuthenticationPrincipal User user,
            @PathVariable Long matchId) {
        return ResponseEntity.ok(chatService.getMessages(user.getId(), matchId));
    }

    @PostMapping("/{matchId}/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @AuthenticationPrincipal User user,
            @PathVariable Long matchId,
            @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(user.getId(), matchId, request.getContent()));
    }

    @PutMapping("/{matchId}/read")
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long matchId) {
        chatService.markMessagesAsRead(user.getId(), matchId);
        return ResponseEntity.ok().build();
    }
}
