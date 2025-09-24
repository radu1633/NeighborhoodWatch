package com.neighborhoodwatch.application.service;

import com.neighborhoodwatch.application.service.PhotoVideo.UploadMediaService;
import com.neighborhoodwatch.domain.model.Incident;
import com.neighborhoodwatch.domain.model.Media;
import com.neighborhoodwatch.domain.model.MediaType;
import com.neighborhoodwatch.infrastructure.repository.MediaRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.FilenameUtils;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MediaService {

    private final MediaRepository repository;
    private final IncidentService incidentService;
    private final UploadMediaService uploadMediaService;
    private final MediaRepository mediaRepository;

    public MediaService(MediaRepository repository, IncidentService incidentService, UploadMediaService uploadMediaService, MediaRepository mediaRepository) {
        this.repository = repository;
        this.incidentService = incidentService;
        this.uploadMediaService = uploadMediaService;
        this.mediaRepository = mediaRepository;
    }

    public List<String> getMedia(Long incidentId) {
        return mediaRepository.findByIncidentId(incidentId).stream()
                .map(media -> media.getMediaPath())
                .toList();
    }

    @Transactional
    public void deleteSingleMedia(Long incidentId, String fullPath) {
        String mediaPath = fullPath.replace("http://192.168.100.38:8080", "");

        // 1. Delete from DB
        mediaRepository.deleteByMediaPath(mediaPath);

        // 2. Delete physical file
        File file = new File(System.getProperty("user.dir") + mediaPath);
        if (file.exists()) {
            file.delete();
        }
    }

    public String uploadMedia(MultipartFile file, Long incidentId) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = FilenameUtils.getExtension(originalFilename).toLowerCase();

        MediaType mediaType = switch (extension) {
            case "mp4" -> MediaType.VIDEO;
            case "jpg", "jpeg", "png", "gif" -> MediaType.IMAGE;
            default -> throw new IllegalArgumentException("Unsupported file type: " + extension);
        };

        String storedPath;
        try {
            if (mediaType == MediaType.IMAGE) {
                storedPath = uploadMediaService.uploadPhoto(file);
            } else {
                storedPath = uploadMediaService.uploadVideo(file);
            }
        } catch (IOException e) {
            throw new EntityNotFoundException(e.getMessage());
        }

        // restul codului pentru salvat în DB
        Incident incident = incidentService.getIncident(incidentId);
        if(incident == null) {
            throw new EntityNotFoundException("Incident not found");
        }

        Media media = new Media();
        media.setIncident(incident);
        media.setMediaPath(storedPath);
        media.setMediaType(mediaType);
        repository.save(media);

        return storedPath;
    }
}
