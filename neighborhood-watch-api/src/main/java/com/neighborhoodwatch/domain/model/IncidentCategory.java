package com.neighborhoodwatch.domain.model;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "INCIDENT_CATEGORIES")
@JsonPropertyOrder({ "id", "categoryName" })
public class IncidentCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", nullable = false, length = 255)
    private String categoryName;

    @Column(name = "category_icon", nullable = false, length = 255)
    private String icon;

    @OneToMany(mappedBy = "category")
    private List<Incident> incidents;

    public IncidentCategory() {}

    public IncidentCategory(String categoryName, String icon) {
        this.categoryName = categoryName;
        this.icon = icon;
    }

    // Getters and Setters
    public Long getId() {
        return categoryId;
    }

    public void setId(Long id) {
        this.categoryId = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getIcon() {return this.icon;}
}
