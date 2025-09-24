package com.neighborhoodwatch.presentation.dto.Neighborhood;

public class NeighborhoodDto {

    private Long id;
    private String name;

    public NeighborhoodDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public NeighborhoodDto() {}

    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
