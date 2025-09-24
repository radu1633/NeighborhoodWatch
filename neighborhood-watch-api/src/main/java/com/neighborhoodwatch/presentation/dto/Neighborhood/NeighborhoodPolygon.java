package com.neighborhoodwatch.presentation.dto.Neighborhood;

import org.locationtech.jts.geom.Polygon;

public class NeighborhoodPolygon {
    private Long id;
    private String name;
    private Polygon polygon;

    public NeighborhoodPolygon(Long id, String name, Polygon polygon) {
        this.id = id;
        this.name = name;
        this.polygon = polygon;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Polygon getPolygon() {
        return polygon;
    }
}
