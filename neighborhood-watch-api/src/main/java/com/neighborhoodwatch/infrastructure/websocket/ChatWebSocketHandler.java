package com.neighborhoodwatch.infrastructure.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.neighborhoodwatch.application.mapper.ChatMapper;
import com.neighborhoodwatch.application.service.ChatService;
import com.neighborhoodwatch.application.service.NotificationService;
import com.neighborhoodwatch.application.service.UserService;
import com.neighborhoodwatch.domain.model.ChatMessage;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.presentation.dto.Chat.ChatMessageDto;
import com.neighborhoodwatch.presentation.dto.Chat.ShowMessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Autowired
    private ChatService chatService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("Nouă conexiune WebSocket: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        ChatMessageDto chatMessage = objectMapper.readValue(payload, ChatMessageDto.class);
        chatMessage.setTimestamp(LocalDateTime.now());

        System.out.println("Primit: " + chatMessage.getMessage());

        ChatMessage chat = chatService.saveMessage(chatMessage);

        List<User> neighbors = userService.findByNeighborhood(chat.getNeighborhood().getId())
                .stream()
                .filter(user -> !user.getId().equals(chat.getUser().getId()))
                .toList();

        notificationService.createAndSendToUsers(
                "Mesaj nou",
                chat.getUser().getFirstName() + " " + chat.getUser().getLastName() + " a trimis un mesaj nou.",
                "MESSAGE_CREATED",
                chat.getMessageId(),
                neighbors
        );

        ShowMessageDto showChat = ChatMapper.toChatMessageDto(chat);

        String json = objectMapper.writeValueAsString(showChat);
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(json));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("Conexiune închisă: " + session.getId());
    }
}
