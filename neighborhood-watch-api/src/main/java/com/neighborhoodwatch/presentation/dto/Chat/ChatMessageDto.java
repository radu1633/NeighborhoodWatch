package com.neighborhoodwatch.presentation.dto.Chat;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


public class ChatMessageDto {
    private Long userId;
    private Long neighborhoodId;
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ChatMessageDto() {}

    public ChatMessageDto(Long userId, Long neighborhoodId, String message) {
        this.userId = userId;
        this.neighborhoodId = neighborhoodId;
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getNeighborhoodId() {
        return neighborhoodId;
    }
    public void setNeighborhoodId(Long neighborhoodId) {
        this.neighborhoodId = neighborhoodId;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
