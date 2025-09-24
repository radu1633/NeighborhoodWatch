package com.neighborhoodwatch.application.mapper;


import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.presentation.dto.User.UserDto;

public class UserMapper {
    public static UserDto toUserDto(User user) {
        Long neighborhoodId;
        if (user.getNeighborhood() == null) {
            neighborhoodId = null;
        } else {
            neighborhoodId = user.getNeighborhood().getId();
        }



        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getProfilePhoto(),
                neighborhoodId,
                user.isAdmin()
        );
    }
}
