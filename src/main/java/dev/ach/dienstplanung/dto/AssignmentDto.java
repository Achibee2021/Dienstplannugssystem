package dev.ach.dienstplanung.dto;


import ai.timefold.solver.core.api.domain.common.PlanningId;
import ai.timefold.solver.core.api.domain.entity.PlanningEntity;
import ai.timefold.solver.core.api.domain.variable.PlanningVariable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@PlanningEntity
public class AssignmentDto {

    @PlanningId
    private String id;

    @PlanningVariable(valueRangeProviderRefs = "employeeRange")
   private EmployeeDto employee;


   private StationDto station;
   private TimeslotDto timeslot;
}
