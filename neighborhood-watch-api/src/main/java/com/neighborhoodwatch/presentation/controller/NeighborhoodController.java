package com.neighborhoodwatch.presentation.controller;

//import com.neighborhoodwatch.application.mapper.NeighborhoodMapper;
import com.neighborhoodwatch.application.mapper.NeighborhoodMapper;
import com.neighborhoodwatch.application.service.NeighborhoodService;
import com.neighborhoodwatch.application.service.UserService;
import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.presentation.dto.Neighborhood.CreateNeighborhoodDto;
import com.neighborhoodwatch.presentation.dto.Neighborhood.NeighborhoodDto;
import com.neighborhoodwatch.presentation.dto.Neighborhood.NeighborhoodPolygon;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/location")
public class NeighborhoodController {


    private final NeighborhoodService neighborhoodService;
    private final UserService userService;

    public NeighborhoodController(NeighborhoodService neighborhoodService, UserService userService) {
        this.neighborhoodService = neighborhoodService;
        this.userService = userService;
    }


    @PutMapping("/exitNeighborhood")
    public ResponseEntity<?> exitNeighborhood(@AuthenticationPrincipal UserDetails userDetails){
        User user = userService.getLoggedUser(userDetails.getUsername());
        userService.exitNeighborhood(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @PostMapping("/extract")
    public ResponseEntity<NeighborhoodDto> extractAddressFromID(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getLoggedUser(userDetails.getUsername());
        try {
            Neighborhood neighborhood = neighborhoodService.extractNeighborhoodFromID(file);
            if (neighborhood == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .build();
            }
            userService.setNeighborhood(user, neighborhood);
            userService.setContacts(user, neighborhood);
            return ResponseEntity.ok(NeighborhoodMapper.toNeighborhoodDto(neighborhood));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

