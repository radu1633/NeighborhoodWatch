package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.Neighborhood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface NeighborhoodRepository extends JpaRepository<Neighborhood, Long> {
}
