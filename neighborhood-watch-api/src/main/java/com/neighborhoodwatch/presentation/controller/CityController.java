package com.neighborhoodwatch.presentation.controller;


import com.neighborhoodwatch.application.mapper.CityMapper;
import com.neighborhoodwatch.application.service.CityService;
import com.neighborhoodwatch.domain.model.City;
import com.neighborhoodwatch.presentation.dto.City.CityDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping
    public ResponseEntity<List<City>> getCities() {
        return ResponseEntity.ok(cityService.getCities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<City> getCity(@RequestParam Long id) {
        City city = cityService.getCityById(id);
        if (city == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(city);
    }

    @PostMapping
    public ResponseEntity<City> createCity(@RequestBody CityDto city) {
        City cityCreated = cityService.createCity(CityMapper.toCity(city));
        if (cityCreated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cityCreated);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<City> deleteCity(@RequestParam Long id) {
        cityService.deleteCity(id);
        return ResponseEntity.ok().build();
    }
}
