package dev.ach.dienstplanung.controller;

import dev.ach.dienstplanung.dto.ScheduleResponse;
import dev.ach.dienstplanung.planning.Schedule;
import dev.ach.dienstplanung.service.DienstPlanningsService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/dienstplan/solve")
@RequiredArgsConstructor
public class DienstPlanController {

    private  final DienstPlanningsService dienstPlanningsService;

    @PostMapping
    public ResponseEntity<UUID> solve(){
        UUID jobId = dienstPlanningsService.solve();
        return ResponseEntity.ok(jobId);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<ScheduleResponse> getSchedule(@PathVariable UUID jobId){
        return ResponseEntity.ok(dienstPlanningsService.getSchedule(jobId));
    }

    @PostMapping("/{jobId}/stop")
    public  ResponseEntity<Void> stopSolving(@PathVariable UUID jobId){
        dienstPlanningsService.stopSolving(jobId);
        return ResponseEntity.ok().build();
    }
}
