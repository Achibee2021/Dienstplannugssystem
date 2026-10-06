package dev.ach.dienstplanung.service;

import dev.ach.dienstplanung.dto.AssignmentDto;
import dev.ach.dienstplanung.dto.StationDto;
import dev.ach.dienstplanung.dto.TimeslotDto;

import java.util.List;
import java.util.Map;

public interface AssignmentService {
    AssignmentDto createAssignment(AssignmentDto assignmentDto);

    List<AssignmentDto> getAllAssignment(Map<String, StationDto> stationsById, Map<String, TimeslotDto> timeslotsById);

    AssignmentDto getAssignmentById(String assignId);

    AssignmentDto updateAssignment(AssignmentDto assignmentDto, String assignId);

    void deleteAssignment(String assignId);
}
