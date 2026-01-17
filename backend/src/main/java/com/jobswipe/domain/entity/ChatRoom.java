package com.jobswipe.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user1_id", "user2_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user1_id should always be less than user2_id for consistent unique constraint
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Helper method to check if a user is part of this chat
    public boolean hasUser(Long userId) {
        return user1.getId().equals(userId) || user2.getId().equals(userId);
    }

    // Helper method to get the other user in the chat
    public User getOtherUser(Long userId) {
        return user1.getId().equals(userId) ? user2 : user1;
    }
}
