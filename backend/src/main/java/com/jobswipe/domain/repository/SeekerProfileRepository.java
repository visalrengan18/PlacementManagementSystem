package com.jobswipe.domain.repository;

import com.jobswipe.domain.entity.SeekerProfile;
import com.jobswipe.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, Long> {

    Optional<SeekerProfile> findByUser(User user);

    Optional<SeekerProfile> findByUserId(Long userId);
}
