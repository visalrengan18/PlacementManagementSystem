package com.jobswipe.controller;

import com.jobswipe.domain.entity.User;
import com.jobswipe.dto.match.MatchDto;
import com.jobswipe.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping("/seeker")
    public ResponseEntity<List<MatchDto>> getSeekerMatches(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(matchService.getSeekerMatches(user.getId()));
    }

    @GetMapping("/company")
    public ResponseEntity<List<MatchDto>> getCompanyMatches(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(matchService.getCompanyMatches(user.getId()));
    }
}
