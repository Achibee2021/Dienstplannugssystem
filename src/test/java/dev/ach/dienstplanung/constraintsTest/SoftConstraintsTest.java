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

public class SoftConstraintsTest {

    ConstraintVerifier<Constraints, Schedule> constraintVerifier
            = ConstraintVerifier.build(new Constraints(),
            Schedule.class, AssignmentDto.class);

    @Test
    void NightShift_penalize(){
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.NACHTSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                new EmployeeDto(),
                new StationDto(),
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::checkNightShiftPreference)
                .given(assignment1)
                .penalizesBy(1);
    }
    @Test
    void noNightShift_noPenalize(){
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.SPAETSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                new EmployeeDto(),
                new StationDto(),
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::checkNightShiftPreference)
                .given(assignment1)
                .penalizesBy(0);
    }
    @Test
    void saturdayWeekend_penalize(){
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.SATURDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.NACHTSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                new EmployeeDto(),
                new StationDto(),
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::checkWeekendPreference)
                .given(assignment1)
                .penalizesBy(1);
    }

    @Test
    void sundayWeekend_penalize(){
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.SUNDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.NACHTSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                new EmployeeDto(),
                new StationDto(),
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::checkWeekendPreference)
                .given(assignment1)
                .penalizesBy(1);
    }

    @Test
    void noWeekend_noPenalize(){
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.FRIDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.SPAETSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                new EmployeeDto(),
                new StationDto(),
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::checkWeekendPreference)
                .given(assignment1)
                .penalizesBy(0);
    }

    @Test
    void shiftPreference_noEquals(){
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
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(8,0),
                LocalTime.of(16,0),
                Type.NACHTSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                employee,
                new StationDto(),
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::checkPreferredShift)
                .given(assignment1)
                .penalizesBy(1);
    }
    @Test
    void shiftPreference_equals(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);
        EmployeeDto employee =new EmployeeDto(
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
                Type.NACHTSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "STA",
                employee,
                new StationDto(),
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::checkPreferredShift)
                .given(assignment1)
                .penalizesBy(0);
    }

    @Test
    void NightShift3Sequence_noPenalize(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);
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
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.TUESDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot3 = new TimeslotDto(
                "ts-3",
                DayOfWeek.WEDNESDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
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
        AssignmentDto assignment3 = new AssignmentDto(
                "ST3",
                employee1,
                new StationDto(),
                timeslot3
        );

        constraintVerifier.verifyThat(Constraints::checkNightShiftSequence)
                .given(assignment1, assignment2,assignment3)
                .penalizesBy(0);
    }

    @Test
    void NightShift3Sequence_penalize(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);
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
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.TUESDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot3 = new TimeslotDto(
                "ts-3",
                DayOfWeek.WEDNESDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot4 = new TimeslotDto(
                "ts-4",
                DayOfWeek.THURSDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot5 = new TimeslotDto(
                "ts-5",
                DayOfWeek.FRIDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot6 = new TimeslotDto(
                "ts-6",
                DayOfWeek.SATURDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
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
        AssignmentDto assignment3 = new AssignmentDto(
                "ST3",
                employee1,
                new StationDto(),
                timeslot3
        );
        AssignmentDto assignment4 = new AssignmentDto(
                "ST4",
                employee1,
                new StationDto(),
                timeslot4
        );
        AssignmentDto assignment5 = new AssignmentDto(
                "ST5",
                employee1,
                new StationDto(),
                timeslot5
        );
        AssignmentDto assignment6 = new AssignmentDto(
                "ST5",
                employee1,
                new StationDto(),
                timeslot6
        );

        constraintVerifier.verifyThat(Constraints::checkNightShiftSequence)
                .given(assignment1, assignment2,assignment3,assignment4,assignment5,assignment6)
                .penalizesBy(3);
    }

    @Test
    void NightShift3Sequence_notExceed(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);
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
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.TUESDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
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

        constraintVerifier.verifyThat(Constraints::checkNightShiftSequence)
                .given(assignment1, assignment2)
                .penalizesBy(0);
    }

    @Test
    void wishDay_penalize(){
        List<DayOfWeek> wunschTage = new ArrayList<>();
        wunschTage.add(DayOfWeek.TUESDAY);
        wunschTage.add(DayOfWeek.WEDNESDAY);
        wunschTage.add(DayOfWeek.FRIDAY);
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);

        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                wunschTage
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.TUESDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::checkDaysOff)
                .given(assignment1)
                .penalizesBy(1);
    }

    @Test
    void wishDay_noPenalize(){
        List<DayOfWeek> wunschTage = new ArrayList<>();
        wunschTage.add(DayOfWeek.TUESDAY);
        wunschTage.add(DayOfWeek.WEDNESDAY);
        wunschTage.add(DayOfWeek.FRIDAY);
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);

        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                new ArrayList<>(),
                wunschTage
        );
        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::checkDaysOff)
                .given(assignment1)
                .penalizesBy(0);
    }

    @Test
    void togetherPreference_penalize(){
        List<String> bevorzugteMitarbeiter1 = new ArrayList<>();
        List<String> bevorzugteMitarbeiter2 = new ArrayList<>();
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);

        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                bevorzugteMitarbeiter1,
                new ArrayList<>()
        );
        EmployeeDto employee2 =new EmployeeDto(
                "em-2",
                "Tom",
                "Arzt",
                40L,
                typeList,
                bevorzugteMitarbeiter2,
                new ArrayList<>()
        );
        bevorzugteMitarbeiter1.add(employee2.getName());
        bevorzugteMitarbeiter2.add(employee1.getName());

        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.MONDAY,
                LocalTime.of(6,0),
                LocalTime.of(14,0),
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
                employee2,
                new StationDto(),
                timeslot2
        );

        constraintVerifier.verifyThat(Constraints::checkTogetherPreference)
                .given(assignment1, assignment2)
                .penalizesBy(1L);
    }

    @Test
    void togetherPreference_noPenalize(){
        List<String> bevorzugteMitarbeiter1 = new ArrayList<>();
        List<String> bevorzugteMitarbeiter2 = new ArrayList<>();
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);

        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                bevorzugteMitarbeiter1,
                new ArrayList<>()
        );
        EmployeeDto employee2 =new EmployeeDto(
                "em-2",
                "Tom",
                "Arzt",
                40L,
                typeList,
                bevorzugteMitarbeiter2,
                new ArrayList<>()
        );
        bevorzugteMitarbeiter1.add(employee2.getName());
        bevorzugteMitarbeiter2.add(employee1.getName());

        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "ST2",
                employee2,
                new StationDto(),
                timeslot1
        );

        constraintVerifier.verifyThat(Constraints::checkTogetherPreference)
                .given(assignment1, assignment2)
                .penalizesBy(0);
    }

    @Test
    void together1Preference_noPenalize(){
        List<String> bevorzugteMitarbeiter1 = new ArrayList<>();
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);

        EmployeeDto employee1 =new EmployeeDto(
                "em-1",
                "Max",
                "PFLEGE",
                40L,
                typeList,
                bevorzugteMitarbeiter1,
                new ArrayList<>()
        );
        EmployeeDto employee2 =new EmployeeDto(
                "em-2",
                "Tom",
                "Arzt",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );
        bevorzugteMitarbeiter1.add(employee2.getName());

        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.MONDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.THURSDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "ST2",
                employee2,
                new StationDto(),
                timeslot2
        );

        constraintVerifier.verifyThat(Constraints::checkTogetherPreference)
                .given(assignment1, assignment2)
                .penalizesBy(0);
    }

    @Test
    void fairnessWeekend_noPenalize(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);
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
                "Tom",
                "Arzt",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );

        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.SATURDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.SUNDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "ST2",
                employee2,
                new StationDto(),
                timeslot2
        );

        constraintVerifier.verifyThat(Constraints::checkWeekendFairness)
                .given(assignment1, assignment2)
                .penalizesBy(0);
    }

    @Test
    void noFairnessWeekend_penalize(){
        List<Type> typeList = new ArrayList<>();
        typeList.add(Type.NACHTSCHICHT);
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
                "Tom",
                "Arzt",
                40L,
                typeList,
                new ArrayList<>(),
                new ArrayList<>()
        );

        TimeslotDto timeslot1 = new TimeslotDto(
                "ts-1",
                DayOfWeek.SATURDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );
        TimeslotDto timeslot2 = new TimeslotDto(
                "ts-2",
                DayOfWeek.SUNDAY,
                LocalTime.of(22,0),
                LocalTime.of(6,0),
                Type.NACHTSCHICHT
        );

        AssignmentDto assignment1 = new AssignmentDto(
                "ST1",
                employee1,
                new StationDto(),
                timeslot1
        );
        AssignmentDto assignment2 = new AssignmentDto(
                "ST2",
                employee2,
                new StationDto(),
                timeslot2
        );
        AssignmentDto assignment3 = new AssignmentDto(
                "ST3",
                employee2,
                new StationDto(),
                timeslot2
        );
        AssignmentDto assignment4 = new AssignmentDto(
                "ST4",
                employee2,
                new StationDto(),
                timeslot2
        );
        AssignmentDto assignment5 = new AssignmentDto(
                "ST5",
                employee2,
                new StationDto(),
                timeslot2
        );

        constraintVerifier.verifyThat(Constraints::checkWeekendFairness)
                .given(assignment1, assignment2,assignment3,assignment4,assignment5)
                .penalizesBy(2);
    }
}
