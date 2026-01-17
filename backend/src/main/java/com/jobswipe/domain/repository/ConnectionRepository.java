package com.jobswipe.domain.repository;

import com.jobswipe.domain.entity.Connection;
import com.jobswipe.domain.entity.ConnectionStatus;
import com.jobswipe.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    @Query("SELECT c FROM Connection c WHERE (c.requester = :user1 AND c.receiver = :user2) OR (c.requester = :user2 AND c.receiver = :user1)")
    Optional<Connection> findByUsers(@Param("user1") User user1, @Param("user2") User user2);

    List<Connection> findByReceiverAndStatus(User receiver, ConnectionStatus status);

    @Query("SELECT c FROM Connection c WHERE (c.requester.id = :userId OR c.receiver.id = :userId) AND c.status = 'ACCEPTED'")
    List<Connection> findAcceptedConnections(@Param("userId") Long userId);

    @Query("SELECT c FROM Connection c WHERE c.receiver.id = :userId AND c.status = 'PENDING'")
    List<Connection> findPendingRequests(@Param("userId") Long userId);

    @Query("SELECT c FROM Connection c WHERE c.requester.id = :userId AND c.status = 'PENDING'")
    List<Connection> findSentRequests(@Param("userId") Long userId);
}
