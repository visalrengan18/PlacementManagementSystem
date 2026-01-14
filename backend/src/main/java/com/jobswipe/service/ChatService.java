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
}
