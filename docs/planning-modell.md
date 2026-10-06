# Spezifikation des Planungsmodells (Timefold)

Dieses Dokument beschreibt detailliert, wie die Geschäftsdomäne innerhalb der **Timefold-Solver-Engine** modelliert wird, um eine 
automatisierte Personalplanung durchzuführen.

----
## 1. Überblick über die Planungsarchitektur
Der Solver bildet die physische Welt in drei zentrale Timefold-Abstraktionen ab:  
1. **Planungslösung(``Schedule``)**: Der Stammcontainer, der alle Problemdaten und Planungsentitäten sowie die 
berechnete Punktzahl enthält.
2. **Planungsentität (``AssignmentDto``)**: Das dynamische Objekt, dessen Variablen sich während des Lösungsprozesses ändern.
3. **Planungsvariablen (``EmployeeDto``)**: Der von Timefold zugewiesene Wert zur Erfüllung einer ``AssignmentDto``.

----
## 2. Planungsentitäten und Variablen
### ``AssignmentDto``(``@PlanningEntity``)
Jedes ``AssignmentDto`` repräsentiert einen einzelnen Schichtplatz an einer bestimmten Station und in einem
bestimmten Zeitfenster, für den ein Mitarbeiter benötigt wird.

- **Feste Eigenschaften(Problemdaten).**
  - ``station``: Die ``StationDto``, die besetzt werden muss.
  - ``timeslot``: Das ``TimeslotDto``(Datum/Uhrzeit/Schifttyp) für die Schicht.
- **Planungsvariable:**
  - ``employee``: ``@PlanningVaraible``
  -  *Nullbares Verhalten:* Timefold darf einen `Einsatz` unbesetzt lassen (`employee = null`), wenn kein geeigneter Mitarbeiter zugewiesen
  werden kann, ohne harte Einschränkungen zu verletzen.

----
## 3. Vorabgenerierung von Einsatzslots (Schichtbedarf)
Anstatt Einsätze dynamisch über ``groupby`` zu zählen, wird der erforderliche Stationsbedarf von der Lösung
in explizite ``AssignmentDto``-Instanzen umgewandelt.
### Instanziierungsstrategie
- Wenn **Station A** für **Timeslot 1** **2 Employee** benötigt, erstellt die Anwendung vorab 2
separate ``Assignemnt``-Entitäten:
  - ``Assignment 1``:``(Station A, Timeslot 1, Employee = null)``
  - ``Assignment 1``:``(Station A, Timeslot 1, Employee = null)``
### Garantie für Mindestbesetzung
Die Mindestbesetzung wird durch die harte Nebenbedingung **"Unassigned Shift Penalty"** gewährleistet:  
- Jede ``AssignmentDto`` mit ``employee == null`` führt zu einer **``-1Hard``-Strafe**.
- Das Erreichen von **``0Hard``** garantiert mathematisch, dass jeder erforderliche Stationszeitplatz
mit einem gültigen Mitarbeiter besetzt wurde.

----
## 4. Solver-Konfiguration und Leistungsoptimierung
Die #solver-Konfiguration wird programmgesteuert über ``TimefoldConfig.java``(``SolverConfig``) verwaltet.
### Konfigurationseinstellungen
- **Zeitlimit(``10s``)**: Gewährt dem Solver bis zu 10 Sekunden, um Schichtkombinationen zu bewerten und
weiche Präferenzen zu optimieren.
-  **Zeitlimit bei fehlender Verbesserung (``3s``): Beendet den Lauf vorzeitig, wenn 3 Sekunden lang keine 
Verbesserung der Punktzahl festgestellt wird, wodurch Ausführungszeit eingespart wird.

```java 
import ai.timefold.solver.core.config.solver.SolverConfig;
import ai.timefold.solver.core.config.solver.termination.TerminationConfig;
import dev.ach.dienstplanung.constraint.Constraints;
import dev.ach.dienstplanung.dto.AssignmentDto;
import dev.ach.dienstplanung.planning.Schedule;
import org.springframework.context.annotation.Bean;

@Bean
public SolverConfig solverConfig() {
  return new SolverConfig()
          .withSolutionClass(Schedule.class)
          .withEntityClasses(AssignmentDto.class)
          .withConstraintProviderClass(Constraints.class)
          .withTerminationConfig(new TerminationConfig()
                  .withSpentLimit(Duration.ofSeconds(10))
                  .withUnimprovedSpentLimit(Duration.ofSeconds(3)));
}

```