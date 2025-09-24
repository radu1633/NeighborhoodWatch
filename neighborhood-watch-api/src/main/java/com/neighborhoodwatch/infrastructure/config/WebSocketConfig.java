package com.neighborhoodwatch.infrastructure.config;

import com.neighborhoodwatch.infrastructure.websocket.ChatWebSocketHandler;
import com.neighborhoodwatch.infrastructure.websocket.NotificationWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatWebSocketHandler chatWebSocketHandler;
    private final NotificationWebSocketHandler notificationWebSocketHandler;

    @Autowired
    public WebSocketConfig(ChatWebSocketHandler chatWebSocketHandler, NotificationWebSocketHandler notificationWebSocketHandler) {
        this.chatWebSocketHandler = chatWebSocketHandler;
        this.notificationWebSocketHandler = notificationWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
                .addHandler(chatWebSocketHandler, "/ws/chat")
                .setAllowedOrigins("*");

        registry
                .addHandler(notificationWebSocketHandler, "/ws/notifications")
                .setAllowedOrigins("*");
    }
}


