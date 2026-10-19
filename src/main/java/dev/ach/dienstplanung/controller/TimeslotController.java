package dev.ach.dienstplanung.controller;

import dev.ach.dienstplanung.dto.TimeslotDto;
import dev.ach.dienstplanung.service.TimeslotService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dienstplan/timeslot")
@AllArgsConstructor
public class TimeslotController {

    private final TimeslotService timeslotService;

    @GetMapping
    public ResponseEntity<List<TimeslotDto>> getAllStation(){
        List<TimeslotDto> allTimeslots = timeslotService.getAllTimeslot();
        return new ResponseEntity<>(allTimeslots, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeslotDto> getTimeslotById(@PathVariable String id){
        TimeslotDto returnTimeslotDto = timeslotService.getTimeslotId(id);
        return ResponseEntity.ok(returnTimeslotDto);
    }

    @PostMapping
    public ResponseEntity<TimeslotDto> createTimeslot(@RequestBody TimeslotDto timeslotDto){
        TimeslotDto savedTimeslot = timeslotService.createTimeslot(timeslotDto);
        return ResponseEntity.ok(savedTimeslot);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeslotDto> updateTimeslot(@RequestBody TimeslotDto timeslotDto, @PathVariable String id){
        TimeslotDto updatedTimeslot = timeslotService.updateTimeslot(timeslotDto, id);
        return ResponseEntity.ok(updatedTimeslot);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeslot(@PathVariable String id){
        timeslotService.deleteTimeslot(id);

        return ResponseEntity.noContent().build();
    }
}
