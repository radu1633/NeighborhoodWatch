package com.neighborhoodwatch.presentation.dto.Neighborhood;

import lombok.Getter;
import lombok.Setter;

public class CreateNeighborhoodDto {
    public String name;
    public Long cityId;

    public CreateNeighborhoodDto() {}

    public CreateNeighborhoodDto(String name, Long cityId) {
        this.name = name;
        this.cityId = cityId;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Long getCityId() {
        return cityId;
    }
    public void setCityId(Long cityId) {
        this.cityId = cityId;
    }

}
