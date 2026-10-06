package dev.ach.dienstplanung.service.impl;


import dev.ach.dienstplanung.dto.*;
import dev.ach.dienstplanung.planning.Schedule;
import dev.ach.dienstplanung.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    private final EmployeeService employeeService;
    private  final StationService stationService;
    private final TimeslotService timeslotService;
    private final AssignmentService assignmentService;


    @Override
    @Transactional(readOnly = true)
    public Schedule load() {

        List<EmployeeDto> employees = employeeService.getAllEmployee();
        List<StationDto> stations = stationService.getAllStation();
        List<TimeslotDto> timeslots = timeslotService.getAllTimeslot();

        Map<String, StationDto> stationsById = stations.stream().collect(
                Collectors.toMap(StationDto::getId, s->s)
        );

        Map<String, TimeslotDto> timeslotsById = timeslots.stream().collect(
                Collectors.toMap(TimeslotDto::getId, t->t)
        );
        List<AssignmentDto> assignments = assignmentService.getAllAssignment(stationsById, timeslotsById);

        return Schedule.builder()
                .assigmentList(assignments)
                .employees(employees)
                .stations(stations)
                .timeslots(timeslots)
                .build();
    }

}
