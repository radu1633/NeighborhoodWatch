package com.neighborhoodwatch.application.mapper;

import com.neighborhoodwatch.domain.model.Incident;
import com.neighborhoodwatch.domain.model.IncidentCategory;
import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.presentation.dto.Incident.CreateIncidentDto;
import com.neighborhoodwatch.presentation.dto.Incident.IncidentDto;

public class IncidentMappers {

    public static Incident toIncident(CreateIncidentDto incidentDto, User loggedUser, IncidentCategory incidentCategory, Neighborhood neighborhood) {
        return new Incident(
                incidentDto.getDescription(),
                loggedUser,
                incidentCategory,
                incidentDto.getLocationLat(),
                incidentDto.getLocationLon(),
                incidentDto.isAnonymous(),
                neighborhood
        );
    }

    public static IncidentDto toIncidentDto(Incident incident) {
        return new IncidentDto(
                incident.getId(),
                incident.getDescription(),
                incident.getCategory().getId(),
                incident.getCategory().getCategoryName(),
                incident.getLocationLat(),
                incident.getLocationLon(),
                incident.isAnonymous(),
                UserMapper.toUserDto(incident.getUser()),
                incident.getNeighborhood().getId(),
                incident.getDate()
        );
    }
}
