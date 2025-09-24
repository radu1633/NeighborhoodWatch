package com.neighborhoodwatch.application.mapper;

import com.neighborhoodwatch.domain.model.City;
import com.neighborhoodwatch.presentation.dto.City.CityDto;

public class CityMapper {

    public static City toCity(CityDto cityDto) {
        return new City(
                cityDto.getName()
        );
    }
}
