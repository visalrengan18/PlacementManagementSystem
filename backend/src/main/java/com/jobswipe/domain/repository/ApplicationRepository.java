package com.jobswipe.domain.repository;

import com.jobswipe.domain.entity.Application;
import com.jobswipe.domain.entity.ApplicationStatus;
import com.jobswipe.domain.entity.JobPost;
import com.jobswipe.domain.entity.SeekerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findBySeeker(SeekerProfile seeker, Pageable pageable);

    Page<Application> findByJob(JobPost job, Pageable pageable);

    Page<Application> findByJobAndStatus(JobPost job, ApplicationStatus status, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.job = :job AND a.status NOT IN ('REJECTED', 'ACCEPTED')")
    Page<Application> findPendingOrViewedByJob(@Param("job") JobPost job, Pageable pageable);

    Optional<Application> findBySeekerAndJob(SeekerProfile seeker, JobPost job);

    boolean existsBySeekerAndJob(SeekerProfile seeker, JobPost job);
}
