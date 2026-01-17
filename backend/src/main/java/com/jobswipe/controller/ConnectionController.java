package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.network.ConnectionDto;
import com.jobswipe.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    @PostMapping("/request/{userId}")
    public ResponseEntity<ConnectionDto> sendRequest(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        return ResponseEntity.ok(connectionService.sendRequest(user.getId(), userId));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Void> acceptRequest(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        connectionService.acceptRequest(user.getId(), id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Void> rejectRequest(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        connectionService.rejectRequest(user.getId(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<ConnectionDto>> getConnections(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(connectionService.getConnections(user.getId()));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ConnectionDto>> getPendingRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(connectionService.getPendingRequests(user.getId()));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<ConnectionDto>> getSentRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(connectionService.getSentRequests(user.getId()));
    }

    @GetMapping("/check/{userId}")
    public ResponseEntity<Map<String, Boolean>> checkConnection(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        boolean isConnected = connectionService.isConnected(user.getId(), userId);
        return ResponseEntity.ok(Map.of("isConnected", isConnected));
    }
}
