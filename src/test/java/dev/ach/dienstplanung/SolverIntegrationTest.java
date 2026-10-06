package dev.ach.dienstplanung;

import ai.timefold.solver.core.api.solver.SolverJob;
import ai.timefold.solver.core.api.solver.SolverManager;
import dev.ach.dienstplanung.dto.*;
import dev.ach.dienstplanung.planning.Schedule;
import dev.ach.dienstplanung.service.ScheduleService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@SpringBootTest
public class SolverIntegrationTest {

    @Autowired
    private SolverManager<Schedule> solverManager;

    @Autowired
    private ScheduleService scheduleService;

    private Schedule createTestSchedule(){
        EmployeeDto employee1 = new EmployeeDto(
                "em-1",
                "Max",
                "Pflege",
                40L,
                Type.NACHTSCHICHT,
                new ArrayList<>(),
                new ArrayList<>()
        );
        EmployeeDto employee2 = new EmployeeDto(
                "em-2",
                "Anna",
                "Pflege",
                40L,
                Type.SPAETSCHICHT,
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
    void scheduleTest(){

        Schedule s = scheduleService.load();
        Assertions.assertSame(s.getStations().getFirst(), s.getAssigmentList().getFirst().getStation());
        Assertions.assertSame(s.getTimeslots().getFirst(), s.getAssigmentList().getFirst().getTimeslot());
        Assertions.assertNull(s.getAssigmentList().getFirst().getEmployee());

    }
}
