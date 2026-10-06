package dev.ach.dienstplanung.service.impl;

import dev.ach.dienstplanung.dto.AssignmentDto;
import dev.ach.dienstplanung.entity.Assignment;
import dev.ach.dienstplanung.entity.Employee;
import dev.ach.dienstplanung.exception.ElementNotFoundException;
import dev.ach.dienstplanung.mapper.AssignmentMapper;
import dev.ach.dienstplanung.planning.Schedule;
import dev.ach.dienstplanung.repository.AssignmentRepository;
import dev.ach.dienstplanung.repository.EmployeeRepository;
import dev.ach.dienstplanung.service.ScheduleWriterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ScheduleWriterServiceImpl implements ScheduleWriterService {
    private final EmployeeRepository employeeRepository;
    private final AssignmentRepository assignmentRepository;


    @Override
    @Transactional
    public void writeBack(Schedule solvedSchedule) {
        List<AssignmentDto> solved = solvedSchedule.getAssigmentList();
        if (solved == null || solved.isEmpty()) return;

        List<String> employeeIds = solved.stream().filter(dto->
                dto.getEmployee() != null)
                .map(dto->
                        dto.getEmployee().getId())
                .distinct()
                .toList();

        Map<String, Employee> employeeEntitiesById = employeeRepository.findAllById(employeeIds).stream()
                .collect(Collectors.toMap(Employee::getId, e->e));

        List<String> assignmentIds = solved.stream().map(
                AssignmentDto::getId
        ).toList();

        Map<String, Assignment> assignmentEntitiesById = assignmentRepository.findAllById(assignmentIds).stream()
                .collect(Collectors.toMap(Assignment::getId, a->a));

        List<Assignment> toSave = new ArrayList<>();
        for (AssignmentDto dto :solved){
            Assignment entity = assignmentEntitiesById.get(dto.getId());
            if (entity == null) throw new ElementNotFoundException("Assignment not found: " +dto.getId());
            AssignmentMapper.applyEmployee(dto, entity,employeeEntitiesById);

            toSave.add(entity);
        }

        assignmentRepository.saveAll(toSave);
    }
}
