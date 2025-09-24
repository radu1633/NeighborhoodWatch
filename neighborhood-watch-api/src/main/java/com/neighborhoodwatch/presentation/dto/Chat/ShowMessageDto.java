package com.neighborhoodwatch.presentation.dto.Chat;

import com.neighborhoodwatch.presentation.dto.User.UserDto;

import java.time.LocalDateTime;

public class ShowMessageDto {
    private UserDto user;
    private Long neighborhoodId;
    private String message;
    private LocalDateTime timestamp;

    public ShowMessageDto(UserDto user, Long neighborhoodId, String message, LocalDateTime timestamp) {
        this.user = user;
        this.neighborhoodId = neighborhoodId;
        this.message = message;
        this.timestamp = timestamp;
    }

    public UserDto getUser() {
        return user;
    }
    public void setUser(UserDto user) {
        this.user = user;
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
