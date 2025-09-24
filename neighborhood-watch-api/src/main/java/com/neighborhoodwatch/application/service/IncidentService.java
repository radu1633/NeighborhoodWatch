package com.neighborhoodwatch.application.service;

import com.neighborhoodwatch.application.mapper.IncidentMappers;
import com.neighborhoodwatch.domain.model.Incident;
import com.neighborhoodwatch.domain.model.IncidentCategory;
import com.neighborhoodwatch.domain.model.Media;
import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.infrastructure.repository.IncidentRepository;
import com.neighborhoodwatch.presentation.dto.Incident.CreateIncidentDto;
import com.neighborhoodwatch.presentation.dto.Incident.IncidentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class IncidentService {

    private static final String BASE_MEDIA_URL = "http://192.168.100.38:8080";
    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;;
    }

    public List<IncidentDto> getAllIncidents() {
        return incidentRepository.findAll().stream()
                .map(IncidentMappers::toIncidentDto)
                .toList();
    }

    public List<IncidentDto> getPagedIncidents(Long neighborhoodId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());

        Page<Incident> incidentPage = incidentRepository.findByNeighborhoodId(neighborhoodId, pageable);

        return incidentPage.stream().map(incident -> {
            IncidentDto dto = IncidentMappers.toIncidentDto(incident);

            List<String> mediaUrls = incident.getMedia().stream()
                    .map(media -> BASE_MEDIA_URL + media.getMediaPath())
                    .collect(Collectors.toList());

            dto.setMediaUrls(mediaUrls);

            return dto;
        }).collect(Collectors.toList());
    }


    public List<IncidentDto> getAllIncidentsByUserId(Long userId, Long neighborhoodId) {
        List<Incident> incidents = incidentRepository.findByUserIdAndNeighborhoodIdOrderByDateDesc(userId, neighborhoodId);

        return incidents.stream().map(incident -> {
            IncidentDto dto = IncidentMappers.toIncidentDto(incident);

            List<String> mediaUrls = incident.getMedia().stream()
                    .map(Media::getMediaPath) // sau getPath(), în funcție ce salvezi
                    .collect(Collectors.toList());

            dto.setMediaUrls(
                    incident.getMedia().stream()
                            .map(media -> BASE_MEDIA_URL + media.getMediaPath())
                            .collect(Collectors.toList())
            );

            return dto;
        }).collect(Collectors.toList());
    }

    public Incident getIncident(Long id) {
        return incidentRepository.findById(id).orElse(null);
    }

    public Incident createIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    public Incident updateIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }


}
