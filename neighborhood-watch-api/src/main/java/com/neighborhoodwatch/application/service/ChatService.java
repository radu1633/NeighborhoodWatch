package com.neighborhoodwatch.application.service;

import com.neighborhoodwatch.application.mapper.ChatMapper;
import com.neighborhoodwatch.application.mapper.UserMapper;
import com.neighborhoodwatch.domain.model.ChatMessage;
import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.infrastructure.repository.ChatMessageRepository;
import com.neighborhoodwatch.presentation.dto.Chat.ChatMessageDto;
import com.neighborhoodwatch.presentation.dto.Chat.ShowMessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.*;

import java.util.List;

@Service
public class ChatService {
    @Autowired
    private ChatMessageRepository chatRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private NeighborhoodService neighborhoodService;

    public ChatMessage saveMessage(ChatMessageDto dto) {
        User user = userService.getUser(dto.getUserId());
        Neighborhood neighborhood = neighborhoodService.getNeighborhood(dto.getNeighborhoodId());

        if (user == null) {
            return null;
        }

        if (neighborhood == null) {
            return null;
        }

        return chatRepo.save(ChatMapper.toChatMessage(user, neighborhood, dto.getMessage()));
    }

    public List<ShowMessageDto> getByNeighborhood(Long neighborhoodId) {
        return chatRepo.findByNeighborhoodIdOrderByTimestampAsc(neighborhoodId)
                .stream()
                .map(m -> new ShowMessageDto(
                        UserMapper.toUserDto(m.getUser()),
                        m.getNeighborhood().getId(),
                        m.getMessage(),
                        m.getTimestamp()
                ))
                .toList();
    }

    public ChatMessage getById(Long id) {
        return chatRepo.findById(id).orElse(null);
    }
}

