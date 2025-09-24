package com.neighborhoodwatch.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "media")
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "media_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "incident_id", nullable = false)
    private Incident incident;

    @Column(name = "media_path", nullable = false)
    private String mediaPath;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", nullable = false)
    private MediaType mediaType; // enum: IMAGE, VIDEO

    public Media() {}

    public Media(Incident incident, String mediaPath, MediaType mediaType) {
        this.incident = incident;
        this.mediaPath = mediaPath;
        this.mediaType = mediaType;
    }

    public Incident getIncident() {
        return incident;
    }
    public void setIncident(Incident incident) {
        this.incident = incident;
    }
    public String getMediaPath() {
        return mediaPath;
    }
    public void setMediaPath(String mediaPath) {
        this.mediaPath = mediaPath;
    }
    public MediaType getMediaType() {
        return mediaType;
    }
    public void setMediaType(MediaType mediaType) {
        this.mediaType = mediaType;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

}
