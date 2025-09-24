package com.neighborhoodwatch.presentation.dto.Notification;

import java.time.LocalDateTime;

public class NotificationRecipientDto {
    private Long id;
    private NotificationDto notification;
    private boolean read;
    private LocalDateTime readAt;

    public NotificationRecipientDto() {}

    public NotificationRecipientDto(Long id, NotificationDto notification, boolean read, LocalDateTime readAt) {
        this.id = id;
        this.notification = notification;
        this.read = read;
        this.readAt = readAt;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public NotificationDto getNotification() {
        return notification;
    }
    public void setNotification(NotificationDto notification) {
        this.notification = notification;
    }
    public boolean isRead() {
        return read;
    }
    public void setRead(boolean read) {
        this.read = read;
    }
    public LocalDateTime getReadAt() {
        return readAt;
    }
    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

}

