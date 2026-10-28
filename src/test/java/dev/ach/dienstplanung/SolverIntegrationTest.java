package dev.ach.dienstplanung;

import ai.timefold.solver.core.api.solver.SolverJob;
import ai.timefold.solver.core.api.solver.SolverManager;
import dev.ach.dienstplanung.dto.*;
import dev.ach.dienstplanung.entity.Assignment;
import dev.ach.dienstplanung.entity.Station;
import dev.ach.dienstplanung.entity.Timeslot;
import dev.ach.dienstplanung.planning.Schedule;
import dev.ach.dienstplanung.repository.AssignmentRepository;
import dev.ach.dienstplanung.repository.StationRepository;
import dev.ach.dienstplanung.repository.TimeslotRepository;
import dev.ach.dienstplanung.service.ScheduleService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@SpringBootTest
@Transactional
public class SolverIntegrationTest {

    @Autowired
    private SolverManager<Schedule> solverManager;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private TimeslotRepository timeslotRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    private Schedule createTestSchedule(){
        List<Type> typeList1 = new ArrayList<>();
        List<Type> typeList2 = new ArrayList<>();
        typeList1.add(Type.NACHTSCHICHT);
        typeList2.add(Type.SPAETSCHICHT);
        EmployeeDto employee1 = new EmployeeDto(
                "em-1",
                "Max",
                "Pflege",
                40L,
                typeList1,
                new ArrayList<>(),
                new ArrayList<>()
        );
        EmployeeDto employee2 = new EmployeeDto(
                "em-2",
                "Anna",
                "Pflege",
                40L,
                typeList2,
                new ArrayList<>(),
                new ArrayList<>()
        );

        StationDto station = new StationDto(
                "st-a",
                "A",
                1,
                "pflege"
        );
        TimeslotDto timeslot = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(13,0),
                Type.FRUESCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "A1",
                null,
                station,
                timeslot
        );

        AssignmentDto assignment2 = new AssignmentDto(
                "A2",
                null,
                station,
                timeslot
        );

        List<EmployeeDto> employeeList = new ArrayList<>();
        employeeList.add(employee1);
        employeeList.add(employee2);

        List<StationDto> stationList = new ArrayList<>();
        stationList.add(station);

        List<TimeslotDto> timeslotList = new ArrayList<>();
        timeslotList.add(timeslot);

        List<AssignmentDto> assignmentList = new ArrayList<>();
        assignmentList.add(assignment1);
        assignmentList.add(assignment2);


        return new Schedule(
                assignmentList,
                employeeList,
                stationList,
                timeslotList,
                null
        );
    }

    @Test
    void shouldSolveSchedule() throws Exception{
        Schedule schedule = createTestSchedule();
        UUID problemId = UUID.randomUUID();

        SolverJob<Schedule> solverJob =
                solverManager.solve(problemId, schedule);

        Schedule solution = solverJob.getFinalBestSolution();

        Assertions.assertNotNull(solution);
    }



    @Test
    @Transactional
    void scheduleTest() {

        String suffix = UUID.randomUUID().toString();

        Station station = new Station(
                "st-test-" + suffix,
                "Test Station",
                1,
                "Pflege"
        );

        Timeslot timeslot = new Timeslot(
                "ts-test-" + suffix,
                DayOfWeek.MONDAY,
                LocalTime.of(8, 0),
                LocalTime.of(13, 0),
                Type.FRUESCHICHT
        );

        stationRepository.save(station);
        timeslotRepository.save(timeslot);

        Assignment assignment = new Assignment(
                "assignment-test-" + suffix,
                station,
                timeslot,
                null
        );

        assignmentRepository.save(assignment);

        Schedule schedule = scheduleService.load();

        AssignmentDto loadedAssignment = schedule.getAssigmentList()
                .stream()
                .filter(a -> a.getId().equals(assignment.getId()))
                .findFirst()
                .orElseThrow();

        Assertions.assertTrue(
                schedule.getStations()
                        .stream()
                        .anyMatch(s -> s.getId().equals(station.getId()))
        );

        Assertions.assertTrue(
                schedule.getTimeslots()
                        .stream()
                        .anyMatch(t -> t.getId().equals(timeslot.getId()))
        );

        Assertions.assertEquals(
                station.getId(),
                loadedAssignment.getStation().getId()
        );

        Assertions.assertEquals(
                timeslot.getId(),
                loadedAssignment.getTimeslot().getId()
        );

        Assertions.assertNull(
                loadedAssignment.getEmployee()
        );
    }
}
