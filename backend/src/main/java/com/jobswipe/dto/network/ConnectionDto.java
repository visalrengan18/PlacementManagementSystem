package com.jobswipe.dto.network;

import com.jobswipe.domain.entity.ConnectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConnectionDto {
    private Long id;
    private UserSummaryDto user;
    private ConnectionStatus status;
    private LocalDateTime createdAt;
    private Boolean isRequester; // true if current user sent the request
}
