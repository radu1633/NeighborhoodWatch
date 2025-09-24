package com.neighborhoodwatch.application.mapper;

import com.neighborhoodwatch.domain.model.ChatMessage;
import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.presentation.dto.Chat.ChatMessageDto;
import com.neighborhoodwatch.presentation.dto.Chat.ShowMessageDto;

public class ChatMapper {

    public static ChatMessage toChatMessage(User user, Neighborhood neighborhood, String text){
        return new ChatMessage(
                user,
                neighborhood,
                text
        );
    }

    public static ShowMessageDto toChatMessageDto(ChatMessage chatMessage){
        return new ShowMessageDto(
                UserMapper.toUserDto(chatMessage.getUser()),
                chatMessage.getNeighborhood().getId(),
                chatMessage.getMessage(),
                chatMessage.getTimestamp()
        );
    }
}
