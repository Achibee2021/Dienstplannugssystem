package dev.ach.dienstplanung.dto;

import ai.timefold.solver.core.api.domain.common.PlanningId;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TimeslotDto {

   @PlanningId
   private String id;

   private DayOfWeek dayOfWeek;
   private LocalTime startTime;
   private LocalTime endTime;
   private Type type;
}
