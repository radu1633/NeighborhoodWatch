package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.IncidentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentCategoryRepository extends JpaRepository<IncidentCategory, Long> {
}