package com.neighborhoodwatch.application.service;

import com.neighborhoodwatch.application.service.Expo.ExpoPushService;
import com.neighborhoodwatch.domain.model.Notification;
import com.neighborhoodwatch.domain.model.NotificationRecipient;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.infrastructure.repository.NotificationRecipientRepository;
import com.neighborhoodwatch.infrastructure.repository.NotificationRepository;
import com.neighborhoodwatch.infrastructure.repository.PushTokenRepository;
import com.neighborhoodwatch.infrastructure.websocket.NotificationBroadcaster;
import com.neighborhoodwatch.presentation.dto.Notification.NotificationDto;
import com.neighborhoodwatch.presentation.dto.Notification.NotificationRecipientDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired private NotificationRepository notificationRepo;
    @Autowired private NotificationRecipientRepository recipientRepo;
    @Autowired private PushTokenRepository pushTokenRepo;
    @Autowired private ExpoPushService expoPushService;
    @Autowired private NotificationBroadcaster broadcaster;

    public void createAndSendToUsers(String title, String message, String type, Long referenceId, List<User> users) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notificationRepo.save(notification);

        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setTitle(title);
        dto.setMessage(message);
        dto.setType(type);
        dto.setReferenceId(referenceId);
        dto.setTimestamp(notification.getTimestamp());

        for (User user : users) {
            NotificationRecipient recipient = new NotificationRecipient();
            recipient.setUser(user);
            recipient.setNotification(notification);
            recipientRepo.save(recipient);

            pushTokenRepo.findByUser(user).ifPresent(token ->
                    expoPushService.sendPush(token.getToken(), title, message)
            );

            NotificationRecipientDto notif = new NotificationRecipientDto();
            notif.setId(recipient.getId());
            notif.setNotification(dto);
             // dacă vrei să transmiți și user info

            broadcaster.broadcast(notif, null); // sau excludeUser dacă vrei
        }

    }

    public List<NotificationRecipientDto> getNotificationsForUser(Long userId) {
        return recipientRepo.findByUserIdOrderByNotification_TimestampDesc(userId).stream()
                .map(rec -> {
                    NotificationDto notif = new NotificationDto();
                    notif.setId(rec.getNotification().getId());
                    notif.setTitle(rec.getNotification().getTitle());
                    notif.setMessage(rec.getNotification().getMessage());
                    notif.setType(rec.getNotification().getType());
                    notif.setReferenceId(rec.getNotification().getReferenceId());
                    notif.setTimestamp(rec.getNotification().getTimestamp());

                    NotificationRecipientDto dto = new NotificationRecipientDto();
                    dto.setId(rec.getId());
                    dto.setNotification(notif);
                    dto.setRead(rec.isRead());
                    dto.setReadAt(rec.getReadAt());
                    return dto;
                })
                .toList();
    }

    public void markAsRead(Long recipientId) {
        NotificationRecipient rec = recipientRepo.findById(recipientId).orElseThrow();
        rec.setRead(true);
        rec.setReadAt(LocalDateTime.now());
        recipientRepo.save(rec);
    }

    public void deleteNotification(Long notificationId) {
        recipientRepo.deleteById(notificationId);
    }
}


