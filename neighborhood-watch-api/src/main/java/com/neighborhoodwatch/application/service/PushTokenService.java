package com.neighborhoodwatch.application.service;

import com.neighborhoodwatch.domain.model.PushToken;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.infrastructure.repository.PushTokenRepository;
import com.neighborhoodwatch.infrastructure.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PushTokenService {

    @Autowired
    private PushTokenRepository repository;

    @Autowired
    private UserRepository userRepository;

    public void saveToken(String email, String token) {
        User user = userRepository.findByEmail(email);

        PushToken pushToken = repository.findByUser(user).orElse(new PushToken());
        pushToken.setUser(user);
        pushToken.setToken(token);

        repository.save(pushToken);
    }
}
