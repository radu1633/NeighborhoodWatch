package com.neighborhoodwatch.presentation.dto.City;

import lombok.Getter;
import lombok.Setter;

public class CityDto {

    private String name;

    public CityDto() {}

    public CityDto(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

}
