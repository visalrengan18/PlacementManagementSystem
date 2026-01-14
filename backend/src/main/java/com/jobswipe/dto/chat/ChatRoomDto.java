package com.jobswipe.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDto {
    private Long id;
    private Long matchId;
    private String otherUserName;
    private Long otherUserId;
    private String lastMessage;
    private String lastMessageTime;
    private long unreadCount;
    private String jobTitle;
}
