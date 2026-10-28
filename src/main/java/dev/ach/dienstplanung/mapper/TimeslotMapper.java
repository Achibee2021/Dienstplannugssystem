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
        Timeslot timeslot = new Timeslot();

        timeslot.setId(timeslotDto.getId());
        timeslot.setDayOfWeek(timeslotDto.getDayOfWeek());
        timeslot.setStartTime(timeslotDto.getStartTime());
        timeslot.setEndTime(timeslotDto.getEndTime());
        timeslot.setType(timeslotDto.getType());
        //timeslot.setCrossesMidnight(timeslotDto.isCrossesMidnight());
        return timeslot;
    }
}
