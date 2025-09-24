package com.neighborhoodwatch.domain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String message;

    private LocalDateTime timestamp = LocalDateTime.now();

    private String type;

    private Long referenceId;

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotificationRecipient> recipients;

    public Notification() {}

    public Notification(String title, String message, String type, Long referenceId) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.referenceId = referenceId;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
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
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public Long getReferenceId() {
        return referenceId;
    }
    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }


}


