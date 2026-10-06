package dev.ach.dienstplanung.service.impl;

import dev.ach.dienstplanung.dto.AssignmentDto;
import dev.ach.dienstplanung.dto.StationDto;
import dev.ach.dienstplanung.dto.TimeslotDto;
import dev.ach.dienstplanung.entity.Assignment;
import dev.ach.dienstplanung.mapper.AssignmentMapper;
import dev.ach.dienstplanung.repository.AssignmentRepository;
import dev.ach.dienstplanung.service.AssignmentService;
import dev.ach.dienstplanung.service.EmployeeService;
import dev.ach.dienstplanung.service.StationService;
import dev.ach.dienstplanung.service.TimeslotService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private AssignmentRepository assignmentRepository;
    private StationService stationService;
    private TimeslotService timeslotService;
    private EmployeeService employeeService;

    //@Override
    /*public AssignmentDto createAssignment(AssignmentDto assignmentDto) {
        Station station = StationMapper.mapToStation(stationService.getStationById(assignmentDto.getStation().getId()));

        Timeslot timeslot = TimeslotMapper.mapToTimeslot(timeslotService.getTimeslotId(assignmentDto.getTimeslot().getId()));

        Employee employee = null;

        if (assignmentDto.getEmployee() != null){

            employee = EmployeeMapper.mapToEmployee(employeeService.getEmployeeById(
                    assignmentDto.getEmployee().getId()
            ));
        }

        Assignment assignment = new Assignment(
                assignmentDto.getId(),
                station,
                timeslot,
                employee
        );

        Assignment savedAssignment = assignmentRepository.save(assignment);
        return AssignmentMapper.mapToAssignmentDto(savedAssignment);
    }*/

    @Override
    public AssignmentDto createAssignment(AssignmentDto assignmentDto) {
        return null;
    }

    @Override
    public List<AssignmentDto> getAllAssignment(Map<String, StationDto> stationsById, Map<String, TimeslotDto> timeslotsById) {

        List<Assignment> assignmentList = assignmentRepository.findAll();

        return assignmentList.stream().map(
                assignment -> AssignmentMapper.mapToAssignmentDto(
                        assignment,
                        stationsById,
                        timeslotsById
                )
        ).collect(Collectors.toList());
    }

    @Override
    public AssignmentDto getAssignmentById(String assignId) {
        return null;
    }

    @Override
    public AssignmentDto updateAssignment(AssignmentDto assignmentDto, String assignId) {
        return null;
    }

    @Override
    public void deleteAssignment(String assignId) {

    }
}
