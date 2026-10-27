package dev.ach.dienstplanung.constraintsTest;

import ai.timefold.solver.core.api.score.stream.test.ConstraintVerifier;
import dev.ach.dienstplanung.constraint.Constraints;
import dev.ach.dienstplanung.dto.*;
import dev.ach.dienstplanung.planning.Schedule;
import org.junit.jupiter.api.Test;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class HardConstraintsTest {


    ConstraintVerifier<Constraints, Schedule> constraintVerifier
            = ConstraintVerifier.build(new Constraints(),
            Schedule.class, AssignmentDto.class);

    @Test
    void noShiftTestPenalizes(){
        AssignmentDto assignment1 = new AssignmentDto();
        assignment1.setId("as-1");
        assignment1.setEmployee(null);
        constraintVerifier.verifyThat(Constraints::assignEveryShift)
                .given(assignment1)
                .penalizesBy(1L);
    }

    @Test
    void noShiftTestNotPenalizes(){
        EmployeeDto employeeDto = new EmployeeDto();
        employeeDto.setId("emp-1");

        AssignmentDto assignment1 = new AssignmentDto();
        assignment1.setId("as-1");
        assignment1.setEmployee(employeeDto);
        constraintVerifier.verifyThat(Constraints::assignEveryShift)
                .given(assignment1)
                .penalizesBy(0);
    }

    @Test
    void employeeConflictTestPenalizes(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        StationDto stationA = new StationDto(
                "st-a",
                "Station A",
                1,
                "PFLEGE"
        );
        StationDto stationB = new StationDto(
                "st-a",
                "Station B",
                1,
                "PFLEGE"
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "tm-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.FRUESCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "tm-2",
                DayOfWeek.MONDAY,
                LocalTime.of(10,0),
                LocalTime.of(18,0),
                Type.SPAETSCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                employee,
                stationA,
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "STB",
                employee,
                stationB,
                timeslot2
        );
        constraintVerifier.verifyThat(Constraints::employeeConflict)
                .given(assignment1, assignment2)
                .penalizesBy(1);
    }

    @Test
    void employeeConflictTest_noOverlap(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        StationDto stationA = new StationDto(
                "st-a",
                "Station A",
                1,
                "PFLEGE"
        );
        StationDto stationB = new StationDto(
                "st-b",
                "Station B",
                1,
                "PFLEGE"
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.FRUESCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.MONDAY,
                LocalTime.of(16,0),
                LocalTime.of(20,0),
                Type.SPAETSCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                employee,
                stationA,
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "STB",
                employee,
                stationB,
                timeslot2
        );
        constraintVerifier.verifyThat(Constraints::employeeConflict)
                .given(assignment1, assignment2)
                .penalizesBy(0);
    }

    @Test
    void employeeConflictTest_differentEmployee(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        EmployeeDto employee1 = new EmployeeDto(
                "em-1",
                "Anna",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        StationDto stationA = new StationDto(
                "st-a",
                "Station A",
                1,
                "PFLEGE"
        );
        StationDto stationB = new StationDto(
                "st-b",
                "Station B",
                1,
                "PFLEGE"
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.FRUESCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.MONDAY,
                LocalTime.of(10,0),
                LocalTime.of(18,0),
                Type.SPAETSCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                employee,
                stationA,
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "STB",
                employee1,
                stationB,
                timeslot2
        );
        constraintVerifier.verifyThat(Constraints::employeeConflict)
                .given(assignment1, assignment2)
                .penalizesBy(0);


    }

    @Test
    void employeeConflictTest_sameStation(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        StationDto stationA = new StationDto(
                "st-a",
                "Station A",
                1,
                "PFLEGE"
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.FRUESCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.MONDAY,
                LocalTime.of(14,0),
                LocalTime.of(18,0),
                Type.SPAETSCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                employee,
                stationA,
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "STB",
                employee,
                stationA,
                timeslot2
        );
        constraintVerifier.verifyThat(Constraints::employeeConflict)
                .given(assignment1, assignment2)
                .penalizesBy(0);


    }

    @Test
    void qualifikationMismatch_penalizes(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );

        StationDto station = new StationDto(
                "st-a",
                "Station 1",
                1,
                "Arzt"
        );

        AssignmentDto assignment = new AssignmentDto(
                "STA",
                employee,
                station,
                new TimeslotDto()
        );

        constraintVerifier.verifyThat(Constraints::chekQualification)
                .given(assignment)
                .penalizesBy(1);
    }

    @Test
    void qualifikationMatches_NoPenalize(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );

        StationDto station = new StationDto(
                "st-a",
                "Station 1",
                1,
                "PFLEGE"
        );

        AssignmentDto assignment = new AssignmentDto(
                "STA",
                employee,
                station,
                new TimeslotDto()
        );

        constraintVerifier.verifyThat(Constraints::chekQualification)
                .given(assignment)
                .penalizesBy(0);
    }
    @Test
    void minimumStaffing_unassigned(){
        StationDto station = new StationDto(
                "st-a",
                "Station A",
                2,
                "PFLEGE"
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.FRUESCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                new EmployeeDto(),
                station,
                timeslot1
        );
        constraintVerifier.verifyThat(Constraints::minimumStaffing)
                .given(assignment1)
                .penalizesBy(0);
    }
    @Test
    void minimumStaffingMatches_noPenalize(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        EmployeeDto employee2 =new EmployeeDto(
                "em-2",
                "Jena",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        StationDto station = new StationDto(
                "st-a",
                "Station A",
                2,
                "PFLEGE"
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.FRUESCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                employee1,
                station,
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "STB",
                employee2,
                station,
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::minimumStaffing)
                .given(assignment1, assignment2)
                .penalizesBy(0);
    }

    @Test
    void minimumStaffing_MoreEmployees_noPenalize(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        EmployeeDto employee2 =new EmployeeDto(
                "em-2",
                "Jena",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        EmployeeDto employee3 =new EmployeeDto(
                "em-3",
                "Nolan",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        StationDto station = new StationDto(
                "st-a",
                "Station A",
                2,
                "PFLEGE"
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.FRUESCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                station,
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "ST2",
                employee2,
                station,
                timeslot1
        );
        AssignmentDto assignment3 = new AssignmentDto(
                "ST3",
                employee3,
                station,
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::minimumStaffing)
                .given(assignment1, assignment2, assignment3)
                .penalizesBy(0);
    }
    @Test
    void maximumWorkingTime_exceed(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(19,0),
                Type.FRUESCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        constraintVerifier.verifyThat(Constraints::maximumWorkingTime)
                .given(assignment1)
                .penalizesBy(1);
    }

    @Test
    void maximumWorkingTime_multipleAssignmentsExceed(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(13,0),
                Type.FRUESCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.MONDAY,
                LocalTime.of(14,0),
                LocalTime.of(20,0),
                Type.FRUESCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "ST2",
                employee1,
                new StationDto(),
                timeslot2
        );
        constraintVerifier.verifyThat(Constraints::maximumWorkingTime)
                .given(assignment1, assignment2)
                .penalizesBy(1);
    }

    @Test
    void maximumWorkingTime_equal(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(18,0),
                Type.FRUESCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        constraintVerifier.verifyThat(Constraints::maximumWorkingTime)
                .given(assignment1)
                .penalizesBy(0);
    }
    @Test
    void maximumWorkingTime_notExceed(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.FRUESCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        constraintVerifier.verifyThat(Constraints::maximumWorkingTime)
                .given(assignment1)
                .penalizesBy(0);
    }

    @Test
    void restTime_exceed(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(18,0),
                LocalTime.of(23,0),
                Type.SPAETSCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.TUESDAY,
                LocalTime.of(8,0),
                LocalTime.of(13,0),
                Type.FRUESCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "ST2",
                employee1,
                new StationDto(),
                timeslot2
        );
        constraintVerifier.verifyThat(Constraints::restTime)
                .given(assignment1, assignment2)
                .penalizesBy(1);
    }

    @Test
    void restTime_equals(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(18,0),
                LocalTime.of(23,0),
                Type.SPAETSCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.TUESDAY,
                LocalTime.of(10,0),
                LocalTime.of(15,0),
                Type.FRUESCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "ST2",
                employee1,
                new StationDto(),
                timeslot2
        );
        constraintVerifier.verifyThat(Constraints::restTime)
                .given(assignment1, assignment2)
                .penalizesBy(0);
    }

    @Test
    void restTime_notExceed(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.FRUESCHICHT);
        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(18,0),
                LocalTime.of(23,0),
                Type.SPAETSCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.TUESDAY,
                LocalTime.of(15,0),
                LocalTime.of(22,0),
                Type.SPAETSCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "ST2",
                employee1,
                new StationDto(),
                timeslot2
        );
        constraintVerifier.verifyThat(Constraints::restTime)
                .given(assignment1, assignment2)
                .penalizesBy(0);
    }
}
