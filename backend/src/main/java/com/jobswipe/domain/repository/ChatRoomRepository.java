package com.jobswipe.domain.repository;

import com.jobswipe.domain.entity.ChatRoom;
import com.jobswipe.domain.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByMatch(Match match);

    Optional<ChatRoom> findByMatchId(Long matchId);

    @Query("SELECT c FROM ChatRoom c WHERE c.match.application.seeker.user.id = :userId OR c.match.application.job.company.user.id = :userId ORDER BY c.createdAt DESC")
    List<ChatRoom> findByUserId(@Param("userId") Long userId);
}
