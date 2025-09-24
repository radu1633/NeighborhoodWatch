package com.neighborhoodwatch.infrastructure.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.presentation.dto.Notification.NotificationDto;
import com.neighborhoodwatch.presentation.dto.Notification.NotificationRecipientDto;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class NotificationBroadcaster {

    private final NotificationWebSocketHandler handler;
    private final ObjectMapper objectMapper;

    public NotificationBroadcaster(NotificationWebSocketHandler handler) {
        this.handler = handler;
        this.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    public void broadcast(NotificationRecipientDto dto, User excludeUser) {
        try {
            String payload = objectMapper.writeValueAsString(dto);

            for (WebSocketSession s : handler.getSessions()) {
                if (!s.isOpen()) continue;
                if (excludeUser != null && s.getPrincipal() != null &&
                        excludeUser.getEmail().equals(s.getPrincipal().getName())) continue;

                s.sendMessage(new TextMessage(payload));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


