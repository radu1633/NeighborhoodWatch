package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.NotificationRecipient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient, Long> {
    List<NotificationRecipient> findByUserIdOrderByNotification_TimestampDesc(Long userId);
    void deleteByNotificationId(Long notificationId);
}
