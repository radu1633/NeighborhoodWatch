package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.ChatMessage;
import com.neighborhoodwatch.domain.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Long> {

}
