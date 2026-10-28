package dev.ach.dienstplanung.dto;

import ai.timefold.solver.core.api.domain.common.PlanningId;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@EqualsAndHashCode // to compare fields instead of memory addresses
public class TimeslotDto {

   @PlanningId
   private String id;

   private DayOfWeek dayOfWeek;
   private LocalTime startTime;
   private LocalTime endTime;
   private Type type;

   public boolean isCrossesMidnight () {
      return  endTime != null && startTime != null && endTime.isBefore(startTime);
   }
}
