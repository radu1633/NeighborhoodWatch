package com.neighborhoodwatch.presentation.dto.Comment;

import lombok.*;

import java.time.LocalDateTime;

public class CommentDto {
    private Long id;
    private Long userId;
    private String author;
    private String authorPicture;
    private String text;
    private LocalDateTime timestamp;

    public CommentDto(Long id, Long userId, String author, String authorPicture, String text, LocalDateTime timestamp) {
        this.id = id;
        this.userId = userId;
        this.author = author;
        this.text = text;
        this.timestamp = timestamp;
        this.authorPicture = authorPicture;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    public String getAuthorPicture() {
        return authorPicture;
    }
    public void setAuthorPicture(String authorPicture) {
        this.authorPicture = authorPicture;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }


}
