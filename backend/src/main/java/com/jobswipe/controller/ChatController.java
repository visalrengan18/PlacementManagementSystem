package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.chat.*;
import com.jobswipe.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final com.jobswipe.config.WebSocketEventListener webSocketEventListener;

    @GetMapping
    public ResponseEntity<List<ChatRoomDto>> getUserChats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getUserChatRooms(user.getId()));
    }

    // Match-based endpoints (for initiating chat from matches page)
    @GetMapping("/{matchId}")
    public ResponseEntity<ChatRoomDto> getChatRoom(
            @AuthenticationPrincipal User user,
            @PathVariable Long matchId) {
        return ResponseEntity.ok(chatService.getOrCreateChatRoom(user.getId(), matchId));
    }

    @GetMapping("/{matchId}/messages")
    public ResponseEntity<Page<MessageDto>> getMessages(
            @AuthenticationPrincipal User user,
            @PathVariable Long matchId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(chatService.getMessages(user.getId(), matchId,
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
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

    // Chat room ID based endpoints (for navigating from chat list)
    @GetMapping("/room/{chatRoomId}")
    public ResponseEntity<ChatRoomDto> getChatRoomById(
            @AuthenticationPrincipal User user,
            @PathVariable Long chatRoomId) {
        return ResponseEntity.ok(chatService.getChatRoomById(user.getId(), chatRoomId));
    }

    @GetMapping("/room/{chatRoomId}/messages")
    public ResponseEntity<Page<MessageDto>> getMessagesByChatRoomId(
            @AuthenticationPrincipal User user,
            @PathVariable Long chatRoomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(chatService.getMessagesByChatRoomId(user.getId(), chatRoomId,
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @PostMapping("/room/{chatRoomId}/messages")
    public ResponseEntity<MessageDto> sendMessageToChatRoom(
            @AuthenticationPrincipal User user,
            @PathVariable Long chatRoomId,
            @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessageToChatRoom(user.getId(), chatRoomId, request.getContent()));
    }

    @PutMapping("/room/{chatRoomId}/read")
    public ResponseEntity<Void> markChatRoomAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long chatRoomId) {
        chatService.markChatRoomMessagesAsRead(user.getId(), chatRoomId);
        return ResponseEntity.ok().build();
    }

    // Direct messaging endpoint (for starting chat with any user)
    @GetMapping("/direct/{userId}")
    public ResponseEntity<ChatRoomDto> getOrCreateDirectChat(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getOrCreateDirectChat(user.getId(), userId));
    }

    @GetMapping("/online")
    public ResponseEntity<java.util.Set<Long>> getOnlineUsers() {
        return ResponseEntity.ok(webSocketEventListener.getOnlineUsers());
    }
}
