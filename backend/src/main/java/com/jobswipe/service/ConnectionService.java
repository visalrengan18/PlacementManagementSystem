package com.jobswipe.service;

import com.jobswipe.dto.network.ConnectionDto;
import java.util.List;

public interface ConnectionService {

    ConnectionDto sendRequest(Long userId, Long targetUserId);

    void acceptRequest(Long userId, Long connectionId);

    void rejectRequest(Long userId, Long connectionId);

    List<ConnectionDto> getConnections(Long userId);

    List<ConnectionDto> getPendingRequests(Long userId);

    List<ConnectionDto> getSentRequests(Long userId);

    boolean isConnected(Long userId, Long targetUserId);
}
