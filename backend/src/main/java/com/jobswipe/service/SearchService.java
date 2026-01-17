package com.jobswipe.service;

import com.jobswipe.dto.network.UserSummaryDto;
import java.util.List;

public interface SearchService {

    List<UserSummaryDto> searchUsers(Long currentUserId, String query, String type);
}
