package com.neighborhoodwatch.presentation.controller;

import com.neighborhoodwatch.application.service.PushTokenService;
import com.neighborhoodwatch.application.service.UserService;
import com.neighborhoodwatch.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/push-token")
public class PushTokenController {


    private final PushTokenService pushTokenService;
    private final UserService userService;

    public PushTokenController(PushTokenService pushTokenService, UserService userService) {
        this.pushTokenService = pushTokenService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Void> savePushToken(@RequestBody Map<String, String> request, @AuthenticationPrincipal UserDetails userDetails) {
        String token = request.get("token");
        pushTokenService.saveToken(userDetails.getUsername(), token);
        return ResponseEntity.ok().build();
    }
}

