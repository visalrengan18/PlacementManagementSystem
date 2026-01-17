package com.jobswipe.service;

import com.jobswipe.dto.chat.ChatRoomDto;
import com.jobswipe.dto.chat.MessageDto;
import java.util.List;

public interface ChatService {

    List<ChatRoomDto> getUserChatRooms(Long userId);

    ChatRoomDto getOrCreateChatRoom(Long userId, Long matchId);

    List<MessageDto> getMessages(Long userId, Long matchId);

    MessageDto sendMessage(Long userId, Long matchId, String content);

    void markMessagesAsRead(Long userId, Long matchId);

    // Chat room ID based methods
    ChatRoomDto getChatRoomById(Long userId, Long chatRoomId);

    List<MessageDto> getMessagesByChatRoomId(Long userId, Long chatRoomId);

    MessageDto sendMessageToChatRoom(Long userId, Long chatRoomId, String content);

    void markChatRoomMessagesAsRead(Long userId, Long chatRoomId);

    // Direct messaging
    ChatRoomDto getOrCreateDirectChat(Long userId, Long otherUserId);
}
