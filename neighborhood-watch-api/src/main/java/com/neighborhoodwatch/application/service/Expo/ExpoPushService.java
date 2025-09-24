package com.neighborhoodwatch.application.service.Expo;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ExpoPushService {

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendPush(String expoPushToken, String title, String message) {
        String url = "https://exp.host/--/api/v2/push/send";

        Map<String, Object> payload = Map.of(
                "to", expoPushToken,
                "sound", "default",
                "title", title,
                "body", message
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("Accept-Encoding", "gzip, deflate");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
        restTemplate.postForEntity(url, request, String.class);
    }
}

