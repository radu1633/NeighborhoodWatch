package com.neighborhoodwatch.application.service;

import com.neighborhoodwatch.domain.model.IncidentCategory;
import com.neighborhoodwatch.infrastructure.repository.IncidentCategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class IncidentCategoryService {

    private final IncidentCategoryRepository repository;

    public IncidentCategoryService(IncidentCategoryRepository repository) {

        this.repository = repository;
    }

    public List<IncidentCategory> getAllCategories() {

        return repository.findAll();
    }

    public IncidentCategory getCategoryById(Long id) {

        return repository.findById(id).orElse(null);
    }

    public IncidentCategory createCategory(IncidentCategory category) {

        return repository.save(category);
    }

    public void deleteCategory(Long id) {

        repository.deleteById(id);
    }
}
