package com.neighborhoodwatch.presentation.controller;

import com.neighborhoodwatch.application.service.JWT.TokenBlacklistService;
import com.neighborhoodwatch.application.service.UserService;
import com.neighborhoodwatch.presentation.dto.User.AuthResponse;
import com.neighborhoodwatch.presentation.dto.User.LoginDto;
import com.neighborhoodwatch.presentation.dto.User.RegisterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterDto registerDto) {
        userService.register(registerDto);
        return(userService.login(registerDto.getEmail(), registerDto.getPassword()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDto loginDto) {
        return userService.login(loginDto.getEmail(), loginDto.getPassword());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.blacklistToken(token);
        }
        return ResponseEntity.ok("Successfully logged out");
    }
}
