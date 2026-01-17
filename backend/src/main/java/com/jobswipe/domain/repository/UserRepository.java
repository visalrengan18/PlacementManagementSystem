package com.jobswipe.domain.repository;

import com.jobswipe.domain.entity.Role;
import com.jobswipe.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String name);

    List<User> findByRoleAndNameContainingIgnoreCase(Role role, String name);
}
