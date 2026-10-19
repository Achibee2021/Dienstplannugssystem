package dev.ach.dienstplanung.controller;

import dev.ach.dienstplanung.dto.AssignmentDto;
import dev.ach.dienstplanung.service.AssignmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dienstplan/assignment")
@AllArgsConstructor
public class AssigmentController {

    private final AssignmentService assignmentService;

    @GetMapping
    public ResponseEntity<List<AssignmentDto>> getAllEmployee(){
        List<AssignmentDto> allAssignment = assignmentService.getAllAssignment();
        return ResponseEntity.ok(allAssignment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentDto> getAssignmentById(@PathVariable String id){
        AssignmentDto returnAssignmentDto = assignmentService.getAssignmentById(id);
        return ResponseEntity.ok(returnAssignmentDto);
    }

    @PostMapping
    public ResponseEntity<AssignmentDto> createAssignment(@RequestBody AssignmentDto assignmentDto){
        AssignmentDto savedAssignment = assignmentService.createAssignment(assignmentDto);
        return new ResponseEntity<>(savedAssignment, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<AssignmentDto> updateAssignment(@RequestBody AssignmentDto assignmentDto, @PathVariable String id){
        AssignmentDto updatedAssignmentDto = assignmentService.updateAssignment(assignmentDto, id);
        return ResponseEntity.ok(updatedAssignmentDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable String id){
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
