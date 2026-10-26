package dev.ach.dienstplanung.dto;


import ai.timefold.solver.core.api.domain.common.PlanningId;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.Duration;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EmployeeDto {

   @PlanningId
   private String id;
   private final Duration ruheTime = Duration.ofHours(11);
   private final Duration maximumWorkingTime = Duration.ofHours(10);
   private String name;
   private String qualification;
   private Long wochenStunden;
   private List<Type> wunschSchicht;
   private List<String> bevorzugtMitarbeiter;
   private List<DayOfWeek> wunschFreiTage;
}
