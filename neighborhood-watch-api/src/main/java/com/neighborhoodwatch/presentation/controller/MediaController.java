package com.neighborhoodwatch.presentation.controller;

import com.neighborhoodwatch.application.service.MediaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping("/{incidentId}")
    public List<String> getMediaByIncidentId(@PathVariable Long incidentId) {
        return mediaService.getMedia(incidentId);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMedia(@RequestParam("file") MultipartFile file, @RequestParam("incidentId") Long incidentId) {
        try{
            String url = mediaService.uploadMedia(file, incidentId);
            return ResponseEntity.status(HttpStatus.CREATED).body(url);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }

    }

    @DeleteMapping
    public ResponseEntity<?> deleteSpecificMedia(
            @RequestParam("incidentId") Long incidentId,
            @RequestParam("path") String fullPath
    ) {
        try {
            mediaService.deleteSingleMedia(incidentId, fullPath);
            return ResponseEntity.ok("Media deleted.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete failed: " + e.getMessage());
        }
    }
}
