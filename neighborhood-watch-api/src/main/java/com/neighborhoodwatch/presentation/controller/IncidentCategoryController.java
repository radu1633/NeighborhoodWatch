package com.neighborhoodwatch.presentation.controller;

import com.neighborhoodwatch.application.service.IncidentCategoryService;
import com.neighborhoodwatch.application.service.PhotoVideo.UploadMediaService;
import com.neighborhoodwatch.domain.model.IncidentCategory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class IncidentCategoryController {

    private final IncidentCategoryService service;
    private final UploadMediaService photoUploadService;

    public IncidentCategoryController(IncidentCategoryService service, UploadMediaService photoUploadService) {
        this.service = service;
        this.photoUploadService = photoUploadService;
    }

    @GetMapping
    public ResponseEntity<List<IncidentCategory>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentCategory> getCategoryById(@PathVariable Long id) {
        IncidentCategory category = service.getCategoryById(id);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(category);
    }

    @PostMapping(value = "/categories", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createCategory(/*@RequestBody IncidentCategoryDto category*/ @RequestParam("categoryName") String categoryName, @RequestParam("file") MultipartFile file) {
        try{
            //if (category != null) {

                String photoUrl = photoUploadService.uploadPhoto(file);

                IncidentCategory entity = new IncidentCategory(categoryName, photoUrl);//IncidentCategoryMapper.toIncidentCategory(category, photoUrl);
                service.createCategory(entity);
            //}
            return ResponseEntity.noContent().build();

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }



}
