package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.PushToken;
import com.neighborhoodwatch.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PushTokenRepository extends JpaRepository<PushToken, Long> {
    Optional<PushToken> findByUser(User user);
}

