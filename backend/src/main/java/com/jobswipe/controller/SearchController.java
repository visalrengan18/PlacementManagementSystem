package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.network.UserSummaryDto;
import com.jobswipe.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<List<UserSummaryDto>> searchUsers(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "all") String type) {
        return ResponseEntity.ok(searchService.searchUsers(user.getId(), q, type));
    }
}
