package dev.ach.dienstplanung.mapper;

import dev.ach.dienstplanung.dto.AssignmentDto;
import dev.ach.dienstplanung.dto.StationDto;
import dev.ach.dienstplanung.dto.TimeslotDto;
import dev.ach.dienstplanung.entity.Assignment;
import dev.ach.dienstplanung.entity.Employee;
import dev.ach.dienstplanung.exception.ElementNotFoundException;


import java.util.Map;
import java.util.Optional;


public class AssignmentMapper {

    public static AssignmentDto mapToAssignmentDto(Assignment assignment, Map<String,StationDto> stationMapId, Map<String,TimeslotDto> timeslotMapId) {
       String stationId = assignment.getStation().getId();
       String timeslotId = assignment.getTimeslot().getId();

       StationDto stationDto = Optional.ofNullable(stationMapId.get(stationId))
               .orElseThrow(()-> new ElementNotFoundException("Station with given Id not found: " + stationId));

       TimeslotDto timeslotDto = Optional.ofNullable(timeslotMapId.get(timeslotId))
               .orElseThrow(()->new ElementNotFoundException("Station with given Id not found: " + timeslotId));

        return new AssignmentDto(
                assignment.getId(),
                null,
                stationDto,
                timeslotDto
        );

    }

    public static void applyEmployee(AssignmentDto dto, Assignment entity, Map<String, Employee> employeeEntitiesById){

        if (dto.getEmployee() == null){
            entity.setEmployee(null);
            return;
        }

        String employeeId = dto.getEmployee().getId();
        Employee employeeEntity = Optional.ofNullable(employeeEntitiesById.get(employeeId))
                .orElseThrow(()-> new ElementNotFoundException("Employee not found: " + employeeId));

        entity.setEmployee(employeeEntity);
    }


}
