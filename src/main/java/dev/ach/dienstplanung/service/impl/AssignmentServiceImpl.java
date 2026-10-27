package dev.ach.dienstplanung.service.impl;

import dev.ach.dienstplanung.dto.AssignmentDto;
import dev.ach.dienstplanung.dto.EmployeeDto;
import dev.ach.dienstplanung.dto.StationDto;
import dev.ach.dienstplanung.dto.TimeslotDto;
import dev.ach.dienstplanung.entity.Assignment;
import dev.ach.dienstplanung.entity.Employee;
import dev.ach.dienstplanung.entity.Station;
import dev.ach.dienstplanung.entity.Timeslot;
import dev.ach.dienstplanung.exception.ElementNotFoundException;
import dev.ach.dienstplanung.mapper.AssignmentMapper;
import dev.ach.dienstplanung.mapper.EmployeeMapper;
import dev.ach.dienstplanung.mapper.StationMapper;
import dev.ach.dienstplanung.mapper.TimeslotMapper;
import dev.ach.dienstplanung.repository.AssignmentRepository;
import dev.ach.dienstplanung.repository.EmployeeRepository;
import dev.ach.dienstplanung.repository.StationRepository;
import dev.ach.dienstplanung.repository.TimeslotRepository;
import dev.ach.dienstplanung.service.AssignmentService;
import dev.ach.dienstplanung.service.EmployeeService;
import dev.ach.dienstplanung.service.StationService;
import dev.ach.dienstplanung.service.TimeslotService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final StationRepository stationRepository;
    private final TimeslotRepository timeslotRepository;
    private final EmployeeRepository employeeRepository;

    private final StationService stationService;
    private final TimeslotService timeslotService;
    private final EmployeeService employeeService;

    //------------------------------------------------------------------------------------------------------------------
    //                                              HELPERS FUNCTION
    //------------------------------------------------------------------------------------------------------------------

    private Station resolveStation(String stationId){
        return stationRepository.findById(stationId)
                .orElseThrow(()-> new ElementNotFoundException("Station not found: " + stationId));
    }
    private Employee resolveEmployee(String employeeId){
        if (employeeId == null) return null;
        return employeeRepository.findById(employeeId)
                .orElseThrow(()-> new ElementNotFoundException("Employee not found: " + employeeId));
    }
    private Timeslot resolveTimeslot(String timeslotId){
        return timeslotRepository.findById(timeslotId)
                .orElseThrow(()->new ElementNotFoundException("Timeslot not found: " + timeslotId));
    }
    //------------------------------------------------------------------------------------------------------------------

    @Override
    @Transactional
    public AssignmentDto createAssignment(AssignmentDto assignmentDto) {

        Station station = resolveStation(assignmentDto.getStation().getId());
        Timeslot timeslot = resolveTimeslot(assignmentDto.getTimeslot().getId());
        Employee employee = assignmentDto.getEmployee() != null
                ? resolveEmployee(assignmentDto.getEmployee().getId())
                : null;

        Assignment entity = new Assignment(
                assignmentDto.getId(),
                station,
                timeslot,
                employee
        );

        Assignment savedAssignment = assignmentRepository.save(entity);

        StationDto stationDto = stationService.getStationById(savedAssignment.getStation().getId());
        TimeslotDto timeslotDto = timeslotService.getTimeslotId(savedAssignment.getTimeslot().getId());
        EmployeeDto employeeDto = savedAssignment.getEmployee() != null
                ? employeeService.getEmployeeById(savedAssignment.getEmployee().getId())
                : null;
        return AssignmentMapper.mapToAssignmentDto(savedAssignment, stationDto,timeslotDto,employeeDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDto> getAllAssignmentForSolver(Map<String, StationDto> stationsById, Map<String, TimeslotDto> timeslotsById) {

        List<Assignment> assignmentList = assignmentRepository.findAll();

        return assignmentList.stream().map(
                assignment -> AssignmentMapper.mapToAssignmentDtoForSolver(
                        assignment,
                        stationsById,
                        timeslotsById
                )
        ).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDto> getAllAssignment() {

        Map<String, StationDto> stationsById = stationService.getAllStation().stream()
                .collect(Collectors.toMap(StationDto::getId, s->s));

        Map<String, TimeslotDto> timeslotsById = timeslotService.getAllTimeslot().stream()
                .collect(Collectors.toMap(TimeslotDto::getId, t->t));

        Map<String, EmployeeDto> employeesById = employeeService.getAllEmployee().stream()
                .collect(Collectors.toMap(EmployeeDto::getId, e->e));
        return assignmentRepository.findAll().stream().map(
                entity-> {
                    StationDto stationDto = stationsById.get(entity.getStation().getId());
                    TimeslotDto timeslotDto = timeslotsById.get(entity.getTimeslot().getId());
                    EmployeeDto employeeDto = entity.getEmployee() != null
                            ? employeesById.get(entity.getEmployee().getId())
                            : null;
                    return AssignmentMapper.mapToAssignmentDto(entity, stationDto, timeslotDto, employeeDto);
                }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AssignmentDto getAssignmentById(String assignId) {

        Assignment entity = assignmentRepository.findById(assignId)
                .orElseThrow(()-> new ElementNotFoundException("Assignment not found: " + assignId));

        StationDto stationDto = stationService.getStationById(entity.getStation().getId());
        TimeslotDto timeslotDto = timeslotService.getTimeslotId(entity.getTimeslot().getId());
        EmployeeDto employeeDto = entity.getEmployee() != null
                ? employeeService.getEmployeeById(entity.getEmployee().getId())
                : null;

        return AssignmentMapper.mapToAssignmentDto(entity, stationDto, timeslotDto, employeeDto);
    }

    @Override
    @Transactional
    public AssignmentDto updateAssignment(AssignmentDto assignmentDto, String assignId) {

        Assignment entity = assignmentRepository.findById(assignId)
                .orElseThrow(()-> new ElementNotFoundException("Assignment not found: " + assignId));

        entity.setStation(resolveStation(assignmentDto.getStation().getId()));
        entity.setTimeslot(resolveTimeslot(assignmentDto.getTimeslot().getId()));
        entity.setEmployee(assignmentDto.getEmployee() != null
                ? resolveEmployee(assignmentDto.getEmployee().getId())
                : null);

        Assignment savedAssignment = assignmentRepository.save(entity);

        StationDto stationDto = stationService.getStationById(savedAssignment.getStation().getId());
        TimeslotDto timeslotDto = timeslotService.getTimeslotId(savedAssignment.getTimeslot().getId());
        EmployeeDto employeeDto = savedAssignment.getEmployee() != null
                ? employeeService.getEmployeeById(savedAssignment.getEmployee().getId())
                : null;

        return AssignmentMapper.mapToAssignmentDto(savedAssignment, stationDto, timeslotDto, employeeDto);
    }

    @Override
    @Transactional
    public void deleteAssignment(String assignId) {
        if (!assignmentRepository.existsById(assignId)){
            throw new ElementNotFoundException("Assignment not found: " + assignId);
        }

        assignmentRepository.deleteById(assignId);

    }

    @Override
    @Transactional
    public AssignmentDto updateEmployee(String id, String employeeId) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(()-> new ElementNotFoundException("Assignment not found: " + id));

        if (employeeId == null || employeeId.isEmpty()) {
            assignment.setEmployee(null);
        } else {

            Employee updatedEmployee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new ElementNotFoundException("Employee not found: " + employeeId));
            assignment.setEmployee(updatedEmployee);
        }

        Assignment savedNewAssignment = assignmentRepository.save(assignment);



        return AssignmentMapper.mapToAssignmentDto(savedNewAssignment, StationMapper.mapToStationDto(savedNewAssignment.getStation()),
                TimeslotMapper.matToTimeslotDto(savedNewAssignment.getTimeslot()),
                savedNewAssignment.getEmployee() != null ? EmployeeMapper.mapToEmployeeDto(savedNewAssignment.getEmployee()) : null);
    }

    @Override
    @Transactional
    public AssignmentDto duplicateAssignment(String assignmentId, String newEmployeeId) {
        Assignment originalAssignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ElementNotFoundException("Assignment not found"));
        if (newEmployeeId == null || newEmployeeId.isEmpty() || newEmployeeId.equals("none")){
            throw  new IllegalArgumentException("Cannot duplicate without an employee");
        }
        Employee employee = employeeRepository.findById(newEmployeeId)
                .orElseThrow(() -> new ElementNotFoundException("Employee not found: " + newEmployeeId));

        Assignment copyAssignment = new Assignment();
        copyAssignment.setId("assign-" + UUID.randomUUID());
        copyAssignment.setStation(originalAssignment.getStation());
        copyAssignment.setTimeslot(originalAssignment.getTimeslot());
        copyAssignment.setEmployee(employee);

        Assignment savedDuplicated = assignmentRepository.save(copyAssignment);
        return AssignmentMapper.mapToAssignmentDto(savedDuplicated, StationMapper.mapToStationDto(savedDuplicated.getStation()),
                TimeslotMapper.matToTimeslotDto(savedDuplicated.getTimeslot()),
                EmployeeMapper.mapToEmployeeDto(savedDuplicated.getEmployee()));
    }

    @Override
    @Transactional
    public AssignmentDto transferAssignment(String id, String employeeId) {
        Assignment target = assignmentRepository.findById(id)
                .orElseThrow(()-> new ElementNotFoundException("assignment not found: " + id));
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(()-> new ElementNotFoundException("employee not found: " + employeeId));

        assignmentRepository.findAll().stream()
                .filter(a-> a.getTimeslot().getId().equals(target.getTimeslot().getId()))
                .filter(a->a.getEmployee() != null && a.getEmployee().getId().equals(employeeId))
                .forEach(a-> {
                    a.setEmployee(null);
                    assignmentRepository.save(a);
                });
        target.setEmployee(employee);
        Assignment saved = assignmentRepository.save(target);

        return AssignmentMapper.mapToAssignmentDto(saved, StationMapper.mapToStationDto(saved.getStation()),
                TimeslotMapper.matToTimeslotDto(saved.getTimeslot()),
                EmployeeMapper.mapToEmployeeDto(saved.getEmployee()));
    }

    @Override
    @Transactional
    public AssignmentDto moveToDay(String assignId, String targetDay, String employeeId) {
        Assignment assignment = assignmentRepository.findById(assignId)
                .orElseThrow(()-> new ElementNotFoundException("assignment not found"));
        Timeslot newTimeslot = timeslotRepository.findAll().stream()
                .filter(t-> t.getDayOfWeek().name().equals(targetDay) && t.getType() ==
                        assignment.getTimeslot().getType())
                .findFirst()
                .orElseThrow(()-> new ElementNotFoundException("timeslot not found"));

        assignment.setTimeslot(newTimeslot);

        if (employeeId != null && !employeeId.isEmpty()){
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(()-> new ElementNotFoundException("Employee not found"));
            assignment.setEmployee(employee);
        }

        Assignment saved = assignmentRepository.save(assignment);
        return AssignmentMapper.mapToAssignmentDto(saved, StationMapper.mapToStationDto(saved.getStation()),
                TimeslotMapper.matToTimeslotDto(saved.getTimeslot()),
                saved.getEmployee() != null ? EmployeeMapper.mapToEmployeeDto(saved.getEmployee()) : null);
    }

    @Override
    @Transactional
    public AssignmentDto duplicateToDay(String assignId, String targetDay, String employeeId) {
        Assignment original = assignmentRepository.findById(assignId)
                .orElseThrow(()-> new ElementNotFoundException("assignment not found"));

        Timeslot newTimeslot = timeslotRepository.findAll().stream()
                .filter(t-> t.getDayOfWeek().name().equals(targetDay) &&
                        t.getType() == original.getTimeslot().getType())
                .findFirst()
                .orElseThrow(()-> new ElementNotFoundException("timeslot not found"));

        Assignment copy = new Assignment();
        copy.setId("assign-" + UUID.randomUUID());
        copy.setStation(original.getStation());
        copy.setTimeslot(newTimeslot);
        copy.setEmployee(original.getEmployee());

        if (employeeId != null && !employeeId.isEmpty()){
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(()-> new ElementNotFoundException("Employee not found"));
            copy.setEmployee(employee);
        } else {
            copy.setEmployee(original.getEmployee());
        }

        Assignment saved = assignmentRepository.save(copy);
        return AssignmentMapper.mapToAssignmentDto(saved, StationMapper.mapToStationDto(saved.getStation()),
                TimeslotMapper.matToTimeslotDto(saved.getTimeslot()),
                saved.getEmployee() != null ? EmployeeMapper.mapToEmployeeDto(saved.getEmployee()) : null);
    }
}
