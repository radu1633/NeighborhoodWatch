package com.neighborhoodwatch.presentation.controller;


import com.neighborhoodwatch.application.mapper.IncidentMappers;
import com.neighborhoodwatch.application.service.*;
import com.neighborhoodwatch.domain.model.Incident;
import com.neighborhoodwatch.domain.model.IncidentCategory;
import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.presentation.dto.Incident.CreateIncidentDto;
import com.neighborhoodwatch.presentation.dto.Incident.IncidentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.neighborhoodwatch.domain.model.User;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService service;
    private final IncidentCategoryService incidentCategoryService;
    private final UserService userService;
    private final NeighborhoodService neighborhoodService;
    private final NotificationService notificationService;

    public IncidentController(IncidentService incidentService, IncidentCategoryService incidentCategoryService, UserService userService, NeighborhoodService neighborhoodService, NotificationService notificationService) {
        this.service = incidentService;
        this.incidentCategoryService = incidentCategoryService;
        this.userService = userService;
        this.neighborhoodService = neighborhoodService;
        this.notificationService = notificationService;
    }

    @GetMapping("/neighborhood")
    public ResponseEntity<List<IncidentDto>> getIncidentsByNeighborhood(@RequestParam Long neighborhoodId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        List<IncidentDto> result = service.getPagedIncidents(neighborhoodId, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user-neighborhood")
    public ResponseEntity<List<IncidentDto>> getUserIncidentsByNeighborhood(@RequestParam Long userId, @RequestParam Long neighborhoodId) {
        List<IncidentDto> result = service.getAllIncidentsByUserId(userId, neighborhoodId);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<IncidentDto>> getIncidents() {
        return ResponseEntity.ok(service.getAllIncidents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentDto> getIncident(@PathVariable Long id) {
        Incident incident = service.getIncident(id);
        return ResponseEntity.ok(IncidentMappers.toIncidentDto(incident));
    }

    @PostMapping("/create")
    public ResponseEntity<Long> createIncident(@RequestBody CreateIncidentDto incidentDto) {
        IncidentCategory category = incidentCategoryService.getCategoryById(incidentDto.getCategory_id());
        Neighborhood neighborhood = neighborhoodService.getNeighborhood(incidentDto.getNeighborhoodId());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.getLoggedUser(email);

        Incident incident = IncidentMappers.toIncident(incidentDto, user, category, neighborhood);
        service.createIncident(incident);

        // 🔔 Trimitere notificări către vecini
        List<User> neighbors = userService.findByNeighborhood(neighborhood.getId());
        notificationService.createAndSendToUsers(
                "Incident raportat",
                "Un nou incident a fost raportat în cartierul tău.",
                "INCIDENT_CREATED",
                incident.getId(),
                neighbors.stream()
                        .filter(u -> !u.getId().equals(user.getId()))
                        .toList()
        );

        return ResponseEntity.ok(incident.getId());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIncident(@PathVariable Long id) {
        service.deleteIncident(id);

        return ResponseEntity.ok("Incident deleted");
    }

    @PostMapping("/test-post")
    public ResponseEntity<String> testPost() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Current user: " + auth.getName());
        System.out.println("Authorities: " + auth.getAuthorities());

        return ResponseEntity.ok("POST OK!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateIncident(@PathVariable Long id, @RequestBody CreateIncidentDto incidentDto) {
        Incident existing = service.getIncident(id);
        if (existing == null) return ResponseEntity.notFound().build();

        IncidentCategory category = incidentCategoryService.getCategoryById(incidentDto.getCategory_id());
        Neighborhood neighborhood = neighborhoodService.getNeighborhood(incidentDto.getNeighborhoodId());

        existing.setDescription(incidentDto.getDescription());
        existing.setAnonymous(incidentDto.isAnonymous());
        existing.setLocationLat(incidentDto.getLocationLat());
        existing.setLocationLon(incidentDto.getLocationLon());
        existing.setCategory(category);
        existing.setNeighborhood(neighborhood);

        service.updateIncident(existing);
        return ResponseEntity.ok("Incident actualizat cu succes");
    }

}
