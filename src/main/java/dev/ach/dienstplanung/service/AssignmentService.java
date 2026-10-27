package dev.ach.dienstplanung.service;

import dev.ach.dienstplanung.dto.AssignmentDto;
import dev.ach.dienstplanung.dto.StationDto;
import dev.ach.dienstplanung.dto.TimeslotDto;

import java.util.List;
import java.util.Map;

public interface AssignmentService {
    AssignmentDto createAssignment(AssignmentDto assignmentDto);

    List<AssignmentDto> getAllAssignmentForSolver(Map<String, StationDto> stationsById, Map<String, TimeslotDto> timeslotsById);

    List<AssignmentDto> getAllAssignment();

    AssignmentDto getAssignmentById(String assignId);

    AssignmentDto updateAssignment(AssignmentDto assignmentDto, String assignId);

    void deleteAssignment(String assignId);

    AssignmentDto updateEmployee(String id, String employeeId);

    AssignmentDto duplicateAssignment(String assignmentId, String newEmployeeId);

    AssignmentDto transferAssignment(String id, String employeeId);

    AssignmentDto moveToDay(String assignId, String targetDay, String employeeId);

    AssignmentDto duplicateToDay(String assignId, String targetDay, String employeeId);
}
