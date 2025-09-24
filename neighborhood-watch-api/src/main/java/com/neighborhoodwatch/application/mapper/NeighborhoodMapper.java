package com.neighborhoodwatch.application.mapper;

import com.neighborhoodwatch.domain.model.City;
import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.presentation.dto.Neighborhood.CreateNeighborhoodDto;
import com.neighborhoodwatch.presentation.dto.Neighborhood.NeighborhoodDto;

public class NeighborhoodMapper {
    public static NeighborhoodDto toNeighborhoodDto(Neighborhood neighborhood) {
        return new NeighborhoodDto(
                neighborhood.getId(),
                neighborhood.getName()

        );
    }
}
