package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findAllByNeighborhoodId(Long neighborhoodId);
}
