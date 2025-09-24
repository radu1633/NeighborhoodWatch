package com.neighborhoodwatch.application.service.PhotoVideo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UploadMediaService {
    @Value("${app.upload.dir:${user.home}/uploads}")
    private String uploadDir;

    public String uploadPhoto(MultipartFile file) throws IOException {

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String uniqueFilename = UUID.randomUUID() + "_" + originalFilename;
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);

        return "/uploads/" + uniqueFilename;
    }

    public String uploadVideo(MultipartFile file) throws IOException {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        if (!originalFilename.endsWith(".mp4")) {
            throw new IllegalArgumentException("Only .mp4 videos are allowed");
        }

        String uniqueFilename = UUID.randomUUID() + "_" + originalFilename;
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);

        return "/uploads/" + uniqueFilename;
    }

}
