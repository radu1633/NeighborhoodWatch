package com.neighborhoodwatch.presentation.dto.Incident;


import com.neighborhoodwatch.presentation.dto.User.UserDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

public class IncidentDto {
    private Long id;

    private String description;

    private Long categoryId;

    private String categoryName;

    private Double locationLat;

    private Double locationLon;

    private boolean isAnonymous;

    private LocalDateTime date;

    private UserDto user;

    private Long neighborhoodId;

    private List<String> mediaUrls;

    public IncidentDto(Long id, String description, Long categoryId, String categoryName, double locationLat, double locationLon, boolean isAnonymous, UserDto user, Long neighborhoodId, LocalDateTime date) {
        this.id = id;
        this.description = description;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.locationLat = locationLat;
        this.locationLon = locationLon;
        this.isAnonymous = isAnonymous;
        this.user = user;
        this.neighborhoodId = neighborhoodId;
        this.date = date;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    public String getCategoryName() {
        return categoryName;
    }
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    public Double getLocationLat() {
        return locationLat;
    }
    public void setLocationLat(Double locationLat) {
        this.locationLat = locationLat;
    }
    public Double getLocationLon() {
        return locationLon;
    }
    public void setLocationLon(Double locationLon) {
        this.locationLon = locationLon;
    }
    public boolean isAnonymous() {
        return isAnonymous;
    }
    public void setAnonymous(boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }
    public LocalDateTime getDate() {
        return date;
    }
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    public Long getNeighborhoodId() {
        return neighborhoodId;
    }
    public void setNeighborhoodId(Long neighborhoodId) {
        this.neighborhoodId = neighborhoodId;
    }
    public List<String> getMediaUrls() {
        return mediaUrls;
    }
    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }
    public UserDto getUser() {
        return user;
    }
    public void setUser(UserDto user) {
        this.user = user;
    }
}



