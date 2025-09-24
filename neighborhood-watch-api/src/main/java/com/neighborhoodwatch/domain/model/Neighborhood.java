package com.neighborhoodwatch.domain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "neighborhoods")
public class Neighborhood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long neighborhoodId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String coordinates; // JSON string: [[lon, lat], [lon, lat], ...]

    public Neighborhood() {}

    public Neighborhood(String name, String coordinates) {
        this.name = name;
        this.coordinates = coordinates;
    }

    public Long getId() {
        return neighborhoodId;
    }
    public void setId(Long neighborhoodId) {
        this.neighborhoodId = neighborhoodId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getCoordinates() {
        return coordinates;
    }
    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

}


