package com.jobswipe.domain.repository;

import com.jobswipe.domain.entity.CompanyProfile;
import com.jobswipe.domain.entity.JobPost;
import com.jobswipe.domain.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Long> {

    List<JobPost> findByCompany(CompanyProfile company);

    Page<JobPost> findByStatus(JobStatus status, Pageable pageable);

    @Query("SELECT j FROM JobPost j WHERE j.status = :status AND j.id NOT IN " +
            "(SELECT a.job.id FROM Application a WHERE a.seeker.id = :seekerId)")
    Page<JobPost> findAvailableJobsForSeeker(@Param("seekerId") Long seekerId,
            @Param("status") JobStatus status,
            Pageable pageable);
}
