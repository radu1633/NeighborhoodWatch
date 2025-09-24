package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
