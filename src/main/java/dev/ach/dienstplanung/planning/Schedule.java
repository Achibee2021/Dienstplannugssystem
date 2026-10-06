package dev.ach.dienstplanung.planning;

import ai.timefold.solver.core.api.domain.solution.PlanningEntityCollectionProperty;
import ai.timefold.solver.core.api.domain.solution.PlanningScore;
import ai.timefold.solver.core.api.domain.solution.PlanningSolution;
import ai.timefold.solver.core.api.domain.solution.ProblemFactCollectionProperty;
import ai.timefold.solver.core.api.domain.valuerange.ValueRangeProvider;
import ai.timefold.solver.core.api.score.HardSoftScore;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;
import dev.ach.dienstplanung.dto.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@PlanningSolution
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Schedule {

    @PlanningEntityCollectionProperty
    @Builder.Default
    @JsonSetter(nulls = Nulls.AS_EMPTY)
    List<AssignmentDto> assigmentList = new ArrayList<>();

    @ValueRangeProvider(id = "employeeRange")
    @ProblemFactCollectionProperty
    @Builder.Default
    @JsonSetter(nulls = Nulls.AS_EMPTY)
    List<EmployeeDto> employees = new ArrayList<>();

    @ProblemFactCollectionProperty
    @Builder.Default
    @JsonSetter(nulls = Nulls.AS_EMPTY)
    List<StationDto> stations = new ArrayList<>();

    @ProblemFactCollectionProperty
    @Builder.Default
    @JsonSetter(nulls = Nulls.AS_EMPTY)
    List<TimeslotDto> timeslots = new ArrayList<>();


    @PlanningScore
    private HardSoftScore score;
}
