package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.*;
import com.jobswipe.domain.repository.*;
import com.jobswipe.dto.chat.*;
import com.jobswipe.exception.ApiException;
import com.jobswipe.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    @Override
    public List<ChatRoomDto> getUserChatRooms(Long userId) {
        User user = getUser(userId);
        List<ChatRoom> chatRooms = chatRoomRepository.findByUserId(userId);

        return chatRooms.stream().map(room -> {
            Match match = room.getMatch();
            User otherUser = getOtherUser(match, user);
            List<Message> messages = messageRepository.findByChatRoomOrderByCreatedAtAsc(room);
            Message lastMsg = messages.isEmpty() ? null : messages.get(messages.size() - 1);
            long unread = messageRepository.countUnreadMessages(room, user);

            return ChatRoomDto.builder()
                    .id(room.getId())
                    .matchId(match.getId())
                    .otherUserName(otherUser.getName())
                    .otherUserId(otherUser.getId())
                    .lastMessage(lastMsg != null ? lastMsg.getContent() : null)
                    .lastMessageTime(
                            lastMsg != null ? lastMsg.getCreatedAt().format(DateTimeFormatter.ofPattern("HH:mm"))
                                    : null)
                    .unreadCount(unread)
                    .jobTitle(match.getApplication().getJob().getTitle())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChatRoomDto getOrCreateChatRoom(Long userId, Long matchId) {
        User user = getUser(userId);
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ApiException("Match not found", HttpStatus.NOT_FOUND));

        validateMatchAccess(match, user);

        ChatRoom chatRoom = chatRoomRepository.findByMatch(match)
                .orElseGet(() -> chatRoomRepository.save(ChatRoom.builder().match(match).build()));

        User otherUser = getOtherUser(match, user);

        return ChatRoomDto.builder()
                .id(chatRoom.getId())
                .matchId(match.getId())
                .otherUserName(otherUser.getName())
                .otherUserId(otherUser.getId())
                .jobTitle(match.getApplication().getJob().getTitle())
                .build();
    }

    @Override
    public List<MessageDto> getMessages(Long userId, Long matchId) {
        User user = getUser(userId);
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ApiException("Match not found", HttpStatus.NOT_FOUND));

        validateMatchAccess(match, user);

        ChatRoom chatRoom = chatRoomRepository.findByMatch(match)
                .orElseThrow(() -> new ApiException("Chat not found", HttpStatus.NOT_FOUND));

        return messageRepository.findByChatRoomOrderByCreatedAtAsc(chatRoom).stream()
                .map(m -> toMessageDto(m, user))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageDto sendMessage(Long userId, Long matchId, String content) {
        User user = getUser(userId);
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ApiException("Match not found", HttpStatus.NOT_FOUND));

        validateMatchAccess(match, user);

        ChatRoom chatRoom = chatRoomRepository.findByMatch(match)
                .orElseGet(() -> chatRoomRepository.save(ChatRoom.builder().match(match).build()));

        Message message = Message.builder()
                .chatRoom(chatRoom)
                .sender(user)
                .content(content)
                .status(MessageStatus.SENT)
                .build();

        message = messageRepository.save(message);
        return toMessageDto(message, user);
    }

    @Override
    @Transactional
    public void markMessagesAsRead(Long userId, Long matchId) {
        User user = getUser(userId);
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ApiException("Match not found", HttpStatus.NOT_FOUND));

        validateMatchAccess(match, user);

        ChatRoom chatRoom = chatRoomRepository.findByMatch(match).orElse(null);
        if (chatRoom != null) {
            messageRepository.markMessagesAsRead(chatRoom, user, MessageStatus.READ);
        }
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    private User getOtherUser(Match match, User currentUser) {
        User seeker = match.getApplication().getSeeker().getUser();
        User company = match.getApplication().getJob().getCompany().getUser();
        return seeker.getId().equals(currentUser.getId()) ? company : seeker;
    }

    private void validateMatchAccess(Match match, User user) {
        Long seekerUserId = match.getApplication().getSeeker().getUser().getId();
        Long companyUserId = match.getApplication().getJob().getCompany().getUser().getId();

        if (!user.getId().equals(seekerUserId) && !user.getId().equals(companyUserId)) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }
    }

    private MessageDto toMessageDto(Message m, User currentUser) {
        return MessageDto.builder()
                .id(m.getId())
                .chatRoomId(m.getChatRoom().getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getName())
                .content(m.getContent())
                .status(m.getStatus())
                .createdAt(m.getCreatedAt())
                .isOwn(m.getSender().getId().equals(currentUser.getId()))
                .build();
    }
}
