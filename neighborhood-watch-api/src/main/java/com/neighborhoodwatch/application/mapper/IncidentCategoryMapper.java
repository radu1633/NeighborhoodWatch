package com.neighborhoodwatch.application.mapper;

import com.neighborhoodwatch.domain.model.IncidentCategory;
import com.neighborhoodwatch.presentation.dto.IncidentCategory.IncidentCategoryDto;

public class IncidentCategoryMapper {

    public static IncidentCategory toIncidentCategory(IncidentCategoryDto category, String url) {
        return new IncidentCategory(
                category.getCategoryName(),
                url
        );
    }
}
