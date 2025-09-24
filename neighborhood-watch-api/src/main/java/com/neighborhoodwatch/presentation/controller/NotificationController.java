package com.neighborhoodwatch.presentation.controller;


import com.neighborhoodwatch.application.mapper.NotificationMapper;
import com.neighborhoodwatch.application.service.*;
import com.neighborhoodwatch.domain.model.*;
import com.neighborhoodwatch.infrastructure.repository.UserRepository;
import com.neighborhoodwatch.presentation.dto.Notification.NotificationDto;
import com.neighborhoodwatch.presentation.dto.Notification.NotificationRecipientDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {


    private final NotificationService notificationService;
    private final UserService userService;
    private final IncidentService incidentService;
    private final ContactService contactService;
    private final ChatService chatService;

    public NotificationController(NotificationService notificationService, UserService userService, IncidentService incidentService, ContactService contactService, ChatService chatService) {
        this.notificationService = notificationService;
        this.userService = userService;
        this.incidentService = incidentService;
        this.contactService = contactService;
        this.chatService = chatService;
    }


    @GetMapping
    public List<NotificationRecipientDto> getMyNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getLoggedUser(userDetails.getUsername());
        return notificationService.getNotificationsForUser(user.getId());
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    // Exemplu: creare notificare pentru toți vecinii
    @PostMapping("/incident")
    public ResponseEntity<Void> notifyNeighborsOfIncident(@RequestParam Long incidentId) {
        Incident incident = incidentService.getIncident(incidentId);
        List<User> neighbors = userService.findByNeighborhood(incident.getNeighborhood().getId());

        notificationService.createAndSendToUsers(
                "Incident raportat",
                "Un nou incident a fost raportat în cartier.",
                "INCIDENT_CREATED",
                incidentId,
                neighbors
        );

        return ResponseEntity.ok().build();
    }

    @PostMapping("/contact")
    public ResponseEntity<Void> notifyNeighborsOfContact(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getLoggedUser(userDetails.getUsername());
        List<User> neighbors = userService.findByNeighborhood(user.getNeighborhood().getId());

        notificationService.createAndSendToUsers(
                "Contact nou",
                user.getFirstName() + " " + user.getLastName()+" s-a alăturat cartierului.",
                "CONTACT_CREATED",
                user.getId(),
                neighbors
        );

        return ResponseEntity.ok().build();
    }

    @PostMapping("/message/{id}")
    public ResponseEntity<Void> notifyNeighborsOfMessage(@PathVariable Long messageId) {
        ChatMessage message = chatService.getById(messageId);
        List<User> neighbors = userService.findByNeighborhood(message.getNeighborhood().getId());

        notificationService.createAndSendToUsers(
                "Mesaj nou",
                message.getUser().getFirstName() + " " + message.getUser().getLastName() + " a trimis un mesaj nou.",
                "MESSAGE_CREATED",
                messageId,
                neighbors
        );

        return ResponseEntity.ok().build();
    }

    @PostMapping("/emergency")
    public ResponseEntity<Void> notifyNeighborsOfEmergency(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getLoggedUser(userDetails.getUsername());
        List<User> emergencyContacts = contactService.getEmergencyContacts(user.getId());

        notificationService.createAndSendToUsers(
                "URGENȚĂ",
                user.getFirstName() + " " + user.getLastName() + " are nevoie de ajutor!",
                "EMERGENCY_CREATED",
                user.getId(),
                emergencyContacts
        );

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }
}

