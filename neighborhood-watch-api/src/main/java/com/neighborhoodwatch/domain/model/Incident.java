package com.neighborhoodwatch.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "incident_id")
    private Long id;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "location_lat")
    private Double locationLat;

    @Column(name = "location_lon")
    private Double locationLon;

    @Column(name = "is_anonymous", nullable = false)
    private boolean isAnonymous = false;

    @Column(name = "date")
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private IncidentCategory category;

    @ManyToOne
    @JoinColumn(name = "neighborhood_id", nullable = false)
    private Neighborhood neighborhood;

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL)
    private List<Media> media;

    public Incident() {}

    public Incident(String description, User user, IncidentCategory category, double locationLat, double locationLon, boolean isAnonymous, Neighborhood neighborhood) {
        this.description = description;
        this.date = LocalDateTime.now();
        this.user = user;
        this.category = category;
        this.locationLat = locationLat;
        this.locationLon = locationLon;
        this.isAnonymous = isAnonymous;
        this.neighborhood = neighborhood;
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
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public IncidentCategory getCategory() {
        return category;
    }
    public void setCategory(IncidentCategory category) {
        this.category = category;
    }
    public Neighborhood getNeighborhood() {
        return neighborhood;
    }
    public void setNeighborhood(Neighborhood neighborhood) {
        this.neighborhood = neighborhood;
    }
    public List<Media> getMedia() {
        return media;
    }
    public void setMedia(List<Media> media) {
        this.media = media;
    }

}
