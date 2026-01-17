package com.jobswipe.service;

import com.jobswipe.dto.chat.ChatRoomDto;
import com.jobswipe.dto.chat.MessageDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ChatService {

    List<ChatRoomDto> getUserChatRooms(Long userId);

    ChatRoomDto getOrCreateChatRoom(Long userId, Long matchId);

    Page<MessageDto> getMessages(Long userId, Long matchId, Pageable pageable);

    MessageDto sendMessage(Long userId, Long matchId, String content);

    void markMessagesAsRead(Long userId, Long matchId);

    // Chat room ID based methods
    ChatRoomDto getChatRoomById(Long userId, Long chatRoomId);

    Page<MessageDto> getMessagesByChatRoomId(Long userId, Long chatRoomId, Pageable pageable);

    MessageDto sendMessageToChatRoom(Long userId, Long chatRoomId, String content);

    void markChatRoomMessagesAsRead(Long userId, Long chatRoomId);

    // Direct messaging
    ChatRoomDto getOrCreateDirectChat(Long userId, Long otherUserId);
}
