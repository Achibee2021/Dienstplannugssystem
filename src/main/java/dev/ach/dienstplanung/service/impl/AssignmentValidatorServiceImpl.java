package dev.ach.dienstplanung.service.impl;

import dev.ach.dienstplanung.dto.ValidationResult;
import dev.ach.dienstplanung.entity.Assignment;
import dev.ach.dienstplanung.entity.Employee;
import dev.ach.dienstplanung.entity.Station;
import dev.ach.dienstplanung.entity.Timeslot;
import dev.ach.dienstplanung.exception.ElementNotFoundException;
import dev.ach.dienstplanung.repository.AssignmentRepository;
import dev.ach.dienstplanung.repository.EmployeeRepository;
import dev.ach.dienstplanung.repository.StationRepository;
import dev.ach.dienstplanung.service.AssignmentValidatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AssignmentValidatorServiceImpl implements AssignmentValidatorService {

    private final AssignmentRepository assignmentRepository;
    private final EmployeeRepository employeeRepository;
    private  final StationRepository stationRepository;


    @Override
    public ValidationResult validate(String assignmentId, String targetEmployeeId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ElementNotFoundException("assignment not found: " + assignmentId));
        Employee employee = employeeRepository.findById(targetEmployeeId)
                .orElseThrow(()-> new ElementNotFoundException("Employee not found: " + targetEmployeeId));
        Station station = assignment.getStation();
        Timeslot timeslot = assignment.getTimeslot();

        long currentStaff = assignmentRepository.findAll().stream()
                .filter(a-> a.getTimeslot().getId().equals(timeslot.getId()))
                .filter(a-> a.getStation().getId().equals(station.getId()))
                .filter(a-> a.getEmployee() != null && !a.getEmployee().getId().equals(employee.getId()))
                .count();

        if (currentStaff >= station.getBenoetigteAnzahlMitarbeiter()){
            return new ValidationResult(false, "Station " + station.getName() + " ist bereits voll besetzt. ");
        }

        List<Assignment> employeeAssignments = assignmentRepository.findAll().stream()
                .filter(a-> a.getEmployee() != null && a.getEmployee().getId().equals(employee.getId()))
                .filter(a-> !a.getId().equals(assignmentId))
                .toList();

        for (Assignment other: employeeAssignments){
            boolean violates = violatesRestTime(other.getTimeslot(), timeslot);
            if (violates){
                return new ValidationResult(false, "Ruhezeit von 11 Stunden zwischen " +
                        other.getTimeslot().getDayOfWeek() + " und " + timeslot.getDayOfWeek() + " verletzt");
            }
        }
        return new ValidationResult(true, null);
    }

    private boolean violatesRestTime(Timeslot t1, Timeslot t2){
        LocalDate monday = LocalDate.of(2026, 10, 26);

        LocalDateTime start1 = LocalDateTime.of(monday.plusDays(t1.getDayOfWeek().getValue() - 1), t1.getStartTime());
        LocalDateTime end1 = LocalDateTime.of(monday.plusDays(t1.getDayOfWeek().getValue() - 1), t1.getEndTime());

        if (t1.getEndTime().isBefore(t1.getStartTime())) end1 = end1.plusDays(1);

        LocalDateTime start2 = LocalDateTime.of(monday.plusDays(t2.getDayOfWeek().getValue() - 1), t2.getStartTime());
        LocalDateTime end2 = LocalDateTime.of(monday.plusDays(t2.getDayOfWeek().getValue() - 1), t2.getEndTime());

        if (t2.getEndTime().isBefore(t2.getStartTime())) end2 = end2.plusDays(1);

        long gap1 = Duration.between(end1, start2).toHours();
        long gap2 = Duration.between(end2, start1).toHours();

        long actualRest = Math.max(gap1, gap2);
        return actualRest > 0 && actualRest < 11;
    }
}
