package com.neighborhoodwatch.presentation.dto.IncidentCategory;

public class IncidentCategoryDto {
    private String categoryName;

    public IncidentCategoryDto(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryName() { return categoryName; }

    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

}
