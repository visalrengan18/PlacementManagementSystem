package com.jobswipe.domain.repository;

import com.jobswipe.domain.entity.ChatRoom;
import com.jobswipe.domain.entity.Message;
import com.jobswipe.domain.entity.MessageStatus;
import com.jobswipe.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom, Pageable pageable);

    List<Message> findByChatRoomOrderByCreatedAtAsc(ChatRoom chatRoom);

    @Modifying
    @Query("UPDATE Message m SET m.status = :status WHERE m.chatRoom = :chatRoom AND m.sender != :user AND m.status != 'READ'")
    int markMessagesAsRead(@Param("chatRoom") ChatRoom chatRoom, @Param("user") User user,
            @Param("status") MessageStatus status);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.chatRoom = :chatRoom AND m.sender != :user AND m.status != 'READ'")
    long countUnreadMessages(@Param("chatRoom") ChatRoom chatRoom, @Param("user") User user);
}
