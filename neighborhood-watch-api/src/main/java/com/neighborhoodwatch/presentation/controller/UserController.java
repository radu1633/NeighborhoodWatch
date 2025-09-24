package com.neighborhoodwatch.presentation.controller;

import com.neighborhoodwatch.application.mapper.UserMapper;
import com.neighborhoodwatch.application.service.UserService;
import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.presentation.dto.User.SetNeighborhoodDto;
import com.neighborhoodwatch.presentation.dto.User.UpdateUserDto;
import com.neighborhoodwatch.presentation.dto.User.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/me")
    public UserDto getLoggedUser(@AuthenticationPrincipal UserDetails userDetails){
        User user = userService.getLoggedUser(userDetails.getUsername());

        return UserMapper.toUserDto(user);
    }

    @PostMapping("/profile-photo")
    public ResponseEntity<String> uploadProfilePhoto(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        User user = userService.getLoggedUser(userDetails.getUsername());
        String path = userService.uploadProfilePhoto(file, user);
        return ResponseEntity.ok(path);
    }

//    @PutMapping("/neighborhood")
//    public ResponseEntity<User> setNeighborhood(@RequestBody SetNeighborhoodDto dto, @AuthenticationPrincipal UserDetails userDetails) {
//        User user = userService.getLoggedUser(userDetails.getUsername());
//        System.out.println(dto.getCode());
//        User u = userService.setNeighborhood(user, dto.getCode());
//        if (u == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        userService.enterNeighborhood(user, dto.getCode());
//
//        return ResponseEntity.ok(u);
//    }

    @PutMapping("/update")
    public ResponseEntity<UserDto> updateUserInfo( @RequestBody UpdateUserDto dto, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getLoggedUser(userDetails.getUsername());
        User updated = userService.updateUserInfo(user, dto);

        return ResponseEntity.ok(UserMapper.toUserDto(updated));
    }
}
