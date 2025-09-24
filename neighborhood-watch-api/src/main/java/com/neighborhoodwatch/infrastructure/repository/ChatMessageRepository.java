package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByNeighborhoodIdOrderByTimestampAsc(Long neighborhoodId);
}
