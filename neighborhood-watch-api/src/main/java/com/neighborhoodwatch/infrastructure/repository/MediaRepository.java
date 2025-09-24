package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByIncidentId(Long incidentId);
    void deleteByMediaPath(String mediaPath);
}

