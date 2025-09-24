package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.Incident;
import com.neighborhoodwatch.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    Page<Incident> findByNeighborhoodId(Long id, Pageable pageable);
    List<Incident> findByUserIdAndNeighborhoodIdOrderByDateDesc(Long userId, Long neighborhoodId);

}
