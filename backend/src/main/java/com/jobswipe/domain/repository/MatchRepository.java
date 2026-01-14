package com.jobswipe.domain.repository;

import com.jobswipe.domain.entity.Application;
import com.jobswipe.domain.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    Optional<Match> findByApplication(Application application);

    @Query("SELECT m FROM Match m WHERE m.application.seeker.id = :seekerId ORDER BY m.matchedAt DESC")
    List<Match> findBySeekerIdOrderByMatchedAtDesc(@Param("seekerId") Long seekerId);

    @Query("SELECT m FROM Match m WHERE m.application.job.company.id = :companyId ORDER BY m.matchedAt DESC")
    List<Match> findByCompanyIdOrderByMatchedAtDesc(@Param("companyId") Long companyId);
}
