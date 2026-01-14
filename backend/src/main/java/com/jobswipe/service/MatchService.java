package com.jobswipe.service;

import com.jobswipe.dto.match.MatchDto;
import java.util.List;

public interface MatchService {

    List<MatchDto> getSeekerMatches(Long userId);

    List<MatchDto> getCompanyMatches(Long userId);
}
