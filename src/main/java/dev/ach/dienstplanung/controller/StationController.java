package dev.ach.dienstplanung.controller;

import dev.ach.dienstplanung.dto.StationDto;
import dev.ach.dienstplanung.service.StationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dienstplan/station")
@AllArgsConstructor
public class StationController {

    private final StationService stationService;

    @GetMapping
    public ResponseEntity<List<StationDto>> getAllStation(){
        List<StationDto> allStation = stationService.getAllStation();
        return ResponseEntity.ok(allStation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StationDto> getStationById(@PathVariable String id){
        StationDto returnStationDto = stationService.getStationById(id);
        return ResponseEntity.ok(returnStationDto);
    }

    @PostMapping
    public ResponseEntity<StationDto> createStation(@RequestBody StationDto stationDto){
        StationDto savedStationDto = stationService.createStation(stationDto);
        return new ResponseEntity<>(savedStationDto,HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StationDto> updateStation(@RequestBody StationDto stationDto, @PathVariable String id){
        StationDto updatedStation = stationService.updateStation(stationDto, id);
        return ResponseEntity.ok(updatedStation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStation(@PathVariable String id){
        stationService.deleteStation(id);

        return ResponseEntity.noContent().build();
    }
}
