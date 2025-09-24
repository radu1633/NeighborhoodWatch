package com.neighborhoodwatch.presentation.dto.Incident;


import lombok.Getter;
import lombok.Setter;


public class CreateIncidentDto {

    private String description;

    private long category_id;

    private Double locationLat;

    private Double locationLon;

    private boolean isAnonymous;

    private Long neighborhoodId;

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public long getCategory_id() {
        return category_id;
    }
    public void setCategory_id(long category_id) {
        this.category_id = category_id;
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

    public void setAnonymous(boolean anonymous) {
        isAnonymous = anonymous;
    }
    public void setNeighborhoodId(Long neighborhoodId) {
        this.neighborhoodId = neighborhoodId;
    }
    public Long getNeighborhoodId() {
        return neighborhoodId;
    }
}
