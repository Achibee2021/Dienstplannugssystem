package dev.ach.dienstplanung.dto;


import ai.timefold.solver.core.api.domain.common.PlanningId;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StationDto {
   @PlanningId
   private String id;

   private String name;
   private Integer benoetigteAnzahlMitarbeiter;
   private String benoetigtQualification;
}
