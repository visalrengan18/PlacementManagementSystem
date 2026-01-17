package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.*;
import com.jobswipe.domain.repository.*;
import com.jobswipe.dto.chat.*;
import com.jobswipe.exception.ApiException;
import com.jobswipe.service.ChatService;
import com.jobswipe.service.NotificationService;
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
        private final NotificationService notificationService;

        @Override
        public List<ChatRoomDto> getUserChatRooms(Long userId) {
                User user = getUser(userId);
                List<ChatRoom> chatRooms = chatRoomRepository.findByUserId(userId);

                return chatRooms.stream().map(room -> {
                        User otherUser = room.getOtherUser(userId);
                        List<Message> messages = messageRepository.findByChatRoomOrderByCreatedAtAsc(room);
                        Message lastMsg = messages.isEmpty() ? null : messages.get(messages.size() - 1);
                        long unread = messageRepository.countUnreadMessages(room, user);

                        return ChatRoomDto.builder()
                                        .id(room.getId())
                                        .otherUserName(otherUser.getName())
                                        .otherUserId(otherUser.getId())
                                        .lastMessage(lastMsg != null ? lastMsg.getContent() : null)
                                        .lastMessageTime(
                                                        lastMsg != null ? lastMsg.getCreatedAt()
                                                                        .format(DateTimeFormatter.ofPattern("HH:mm"))
                                                                        : null)
                                        .unreadCount(unread)
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

                // Get both users from the match
                User seekerUser = match.getApplication().getSeeker().getUser();
                User companyUser = match.getApplication().getJob().getCompany().getUser();

                ChatRoom chatRoom = getOrCreateChatBetweenUsers(seekerUser, companyUser);
                User otherUser = chatRoom.getOtherUser(userId);

                return ChatRoomDto.builder()
                                .id(chatRoom.getId())
                                .matchId(match.getId())
                                .otherUserName(otherUser.getName())
                                .otherUserId(otherUser.getId())
                                .build();
        }

        @Override
        public List<MessageDto> getMessages(Long userId, Long matchId) {
                User user = getUser(userId);
                Match match = matchRepository.findById(matchId)
                                .orElseThrow(() -> new ApiException("Match not found", HttpStatus.NOT_FOUND));

                validateMatchAccess(match, user);

                User seekerUser = match.getApplication().getSeeker().getUser();
                User companyUser = match.getApplication().getJob().getCompany().getUser();

                ChatRoom chatRoom = chatRoomRepository.findByUsers(seekerUser.getId(), companyUser.getId())
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

                User seekerUser = match.getApplication().getSeeker().getUser();
                User companyUser = match.getApplication().getJob().getCompany().getUser();

                ChatRoom chatRoom = getOrCreateChatBetweenUsers(seekerUser, companyUser);

                return sendMessageToRoom(chatRoom, user, content);
        }

        @Override
        @Transactional
        public void markMessagesAsRead(Long userId, Long matchId) {
                User user = getUser(userId);
                Match match = matchRepository.findById(matchId)
                                .orElseThrow(() -> new ApiException("Match not found", HttpStatus.NOT_FOUND));

                validateMatchAccess(match, user);

                User seekerUser = match.getApplication().getSeeker().getUser();
                User companyUser = match.getApplication().getJob().getCompany().getUser();

                chatRoomRepository.findByUsers(seekerUser.getId(), companyUser.getId())
                                .ifPresent(chatRoom -> messageRepository.markMessagesAsRead(chatRoom, user,
                                                MessageStatus.READ));
        }

        @Override
        public ChatRoomDto getChatRoomById(Long userId, Long chatRoomId) {
                User user = getUser(userId);
                ChatRoom chatRoom = getChatRoomWithAccess(chatRoomId, user);

                return ChatRoomDto.builder()
                                .id(chatRoom.getId())
                                .otherUserName(chatRoom.getOtherUser(userId).getName())
                                .otherUserId(chatRoom.getOtherUser(userId).getId())
                                .build();
        }

        @Override
        public List<MessageDto> getMessagesByChatRoomId(Long userId, Long chatRoomId) {
                User user = getUser(userId);
                ChatRoom chatRoom = getChatRoomWithAccess(chatRoomId, user);

                return messageRepository.findByChatRoomOrderByCreatedAtAsc(chatRoom).stream()
                                .map(m -> toMessageDto(m, user))
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public MessageDto sendMessageToChatRoom(Long userId, Long chatRoomId, String content) {
                User user = getUser(userId);
                ChatRoom chatRoom = getChatRoomWithAccess(chatRoomId, user);
                return sendMessageToRoom(chatRoom, user, content);
        }

        @Override
        @Transactional
        public void markChatRoomMessagesAsRead(Long userId, Long chatRoomId) {
                User user = getUser(userId);
                ChatRoom chatRoom = getChatRoomWithAccess(chatRoomId, user);
                messageRepository.markMessagesAsRead(chatRoom, user, MessageStatus.READ);
        }

        // New method: Get or create direct chat between any two users
        @Transactional
        public ChatRoomDto getOrCreateDirectChat(Long userId, Long otherUserId) {
                User user = getUser(userId);
                User otherUser = getUser(otherUserId);

                ChatRoom chatRoom = getOrCreateChatBetweenUsers(user, otherUser);

                return ChatRoomDto.builder()
                                .id(chatRoom.getId())
                                .otherUserName(otherUser.getName())
                                .otherUserId(otherUser.getId())
                                .build();
        }

        // Helper: Get or create chat room between two users
        private ChatRoom getOrCreateChatBetweenUsers(User user1, User user2) {
                // Ensure consistent ordering: lower ID first
                Long id1 = Math.min(user1.getId(), user2.getId());
                Long id2 = Math.max(user1.getId(), user2.getId());
                User first = user1.getId().equals(id1) ? user1 : user2;
                User second = user1.getId().equals(id2) ? user1 : user2;

                return chatRoomRepository.findByUsers(id1, id2)
                                .orElseGet(() -> chatRoomRepository.save(ChatRoom.builder()
                                                .user1(first)
                                                .user2(second)
                                                .build()));
        }

        // Helper: Send message and create notification
        private MessageDto sendMessageToRoom(ChatRoom chatRoom, User sender, String content) {
                Message message = Message.builder()
                                .chatRoom(chatRoom)
                                .sender(sender)
                                .content(content)
                                .status(MessageStatus.SENT)
                                .build();

                message = messageRepository.save(message);

                User otherUser = chatRoom.getOtherUser(sender.getId());
                notificationService.createNotification(
                                otherUser.getId(),
                                NotificationType.MESSAGE,
                                "New Message",
                                sender.getName() + ": "
                                                + (content.length() > 50 ? content.substring(0, 50) + "..." : content),
                                chatRoom.getId());

                return toMessageDto(message, sender);
        }

        private ChatRoom getChatRoomWithAccess(Long chatRoomId, User user) {
                ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                                .orElseThrow(() -> new ApiException("Chat room not found", HttpStatus.NOT_FOUND));

                if (!chatRoom.hasUser(user.getId())) {
                        throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
                }

                return chatRoom;
        }

        private User getUser(Long userId) {
                return userRepository.findById(userId)
                                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
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
