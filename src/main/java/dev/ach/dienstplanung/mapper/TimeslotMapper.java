package dev.ach.dienstplanung.mapper;

import dev.ach.dienstplanung.dto.TimeslotDto;
import dev.ach.dienstplanung.entity.Timeslot;

public class TimeslotMapper {

    public static TimeslotDto matToTimeslotDto(Timeslot timeslot){
        return new TimeslotDto(
                timeslot.getId(),
                timeslot.getDayOfWeek(),
                timeslot.getStartTime(),
                timeslot.getEndTime(),
                timeslot.getType()
        );
    }

    public static Timeslot mapToTimeslot(TimeslotDto timeslotDto){
        return new Timeslot(
                timeslotDto.getId(),
                timeslotDto.getDayOfWeek(),
                timeslotDto.getStartTime(),
                timeslotDto.getEndTime(),
                timeslotDto.getType()
        );
    }
}
