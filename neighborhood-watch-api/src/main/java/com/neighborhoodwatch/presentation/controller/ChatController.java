package com.neighborhoodwatch.presentation.controller;

import com.neighborhoodwatch.application.service.ChatService;
import com.neighborhoodwatch.presentation.dto.Chat.ChatMessageDto;
import com.neighborhoodwatch.presentation.dto.Chat.ShowMessageDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/{neighborhoodId}")
    public List<ShowMessageDto> getMessages(@PathVariable Long neighborhoodId) {
        return chatService.getByNeighborhood(neighborhoodId);
    }
}
