package com.jobswipe.service.impl;

import com.jobswipe.domain.entity.*;
import com.jobswipe.domain.repository.*;
import com.jobswipe.dto.network.ConnectionDto;
import com.jobswipe.dto.network.UserSummaryDto;
import com.jobswipe.exception.ApiException;
import com.jobswipe.service.ConnectionService;
import com.jobswipe.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConnectionServiceImpl implements ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public ConnectionDto sendRequest(Long userId, Long targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new ApiException("Cannot connect with yourself", HttpStatus.BAD_REQUEST);
        }

        User requester = getUser(userId);
        User receiver = getUser(targetUserId);

        // Only seekers can connect with other seekers
        if (requester.getRole() != Role.SEEKER || receiver.getRole() != Role.SEEKER) {
            throw new ApiException("Connections are only available between seekers", HttpStatus.BAD_REQUEST);
        }

        // Check if connection already exists
        if (connectionRepository.findByUsers(requester, receiver).isPresent()) {
            throw new ApiException("Connection request already exists", HttpStatus.BAD_REQUEST);
        }

        Connection connection = Connection.builder()
                .requester(requester)
                .receiver(receiver)
                .status(ConnectionStatus.PENDING)
                .build();

        connection = connectionRepository.save(connection);

        // Notify the receiver
        notificationService.createNotification(
                targetUserId,
                NotificationType.PROFILE_VIEW,
                "Connection Request",
                requester.getName() + " wants to connect with you",
                connection.getId());

        return toConnectionDto(connection, userId);
    }

    @Override
    @Transactional
    public void acceptRequest(Long userId, Long connectionId) {
        Connection connection = getConnectionWithAccess(connectionId, userId);

        if (!connection.getReceiver().getId().equals(userId)) {
            throw new ApiException("Only the receiver can accept", HttpStatus.FORBIDDEN);
        }

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new ApiException("Connection is not pending", HttpStatus.BAD_REQUEST);
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        connectionRepository.save(connection);

        // Notify the requester
        notificationService.createNotification(
                connection.getRequester().getId(),
                NotificationType.MATCH,
                "Connection Accepted! 🎉",
                connection.getReceiver().getName() + " accepted your connection request",
                connection.getId());
    }

    @Override
    @Transactional
    public void rejectRequest(Long userId, Long connectionId) {
        Connection connection = getConnectionWithAccess(connectionId, userId);

        if (!connection.getReceiver().getId().equals(userId)) {
            throw new ApiException("Only the receiver can reject", HttpStatus.FORBIDDEN);
        }

        connection.setStatus(ConnectionStatus.REJECTED);
        connectionRepository.save(connection);
    }

    @Override
    public List<ConnectionDto> getConnections(Long userId) {
        return connectionRepository.findAcceptedConnections(userId).stream()
                .map(c -> toConnectionDto(c, userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<ConnectionDto> getPendingRequests(Long userId) {
        User user = getUser(userId);
        return connectionRepository.findByReceiverAndStatus(user, ConnectionStatus.PENDING).stream()
                .map(c -> toConnectionDto(c, userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<ConnectionDto> getSentRequests(Long userId) {
        return connectionRepository.findSentRequests(userId).stream()
                .map(c -> toConnectionDto(c, userId))
                .collect(Collectors.toList());
    }

    @Override
    public boolean isConnected(Long userId, Long targetUserId) {
        User user1 = userRepository.findById(userId).orElse(null);
        User user2 = userRepository.findById(targetUserId).orElse(null);
        if (user1 == null || user2 == null)
            return false;

        return connectionRepository.findByUsers(user1, user2)
                .map(c -> c.getStatus() == ConnectionStatus.ACCEPTED)
                .orElse(false);
    }

    private Connection getConnectionWithAccess(Long connectionId, Long userId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ApiException("Connection not found", HttpStatus.NOT_FOUND));

        if (!connection.getRequester().getId().equals(userId) &&
                !connection.getReceiver().getId().equals(userId)) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        return connection;
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    private ConnectionDto toConnectionDto(Connection connection, Long currentUserId) {
        User otherUser = connection.getRequester().getId().equals(currentUserId)
                ? connection.getReceiver()
                : connection.getRequester();

        String title = null;
        String location = null;
        var profile = seekerProfileRepository.findByUserId(otherUser.getId()).orElse(null);
        if (profile != null) {
            title = profile.getTitle();
            location = profile.getLocation();
        }

        UserSummaryDto userSummary = UserSummaryDto.builder()
                .id(otherUser.getId())
                .name(otherUser.getName())
                .email(otherUser.getEmail())
                .role(otherUser.getRole())
                .title(title)
                .location(location)
                .build();

        return ConnectionDto.builder()
                .id(connection.getId())
                .user(userSummary)
                .status(connection.getStatus())
                .createdAt(connection.getCreatedAt())
                .isRequester(connection.getRequester().getId().equals(currentUserId))
                .build();
    }
}
