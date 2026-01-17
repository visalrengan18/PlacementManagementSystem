package com.jobswipe.domain.repository;

import com.jobswipe.domain.entity.ChatRoom;
import com.jobswipe.domain.entity.CompanyProfile;
import com.jobswipe.domain.entity.SeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findBySeekerAndCompany(SeekerProfile seeker, CompanyProfile company);

    @Query("SELECT c FROM ChatRoom c WHERE c.seeker.user.id = :userId OR c.company.user.id = :userId ORDER BY c.createdAt DESC")
    List<ChatRoom> findByUserId(@Param("userId") Long userId);
}
