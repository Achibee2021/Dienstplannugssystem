package dev.ach.dienstplanung.service;

import dev.ach.dienstplanung.dto.TimeslotDto;

import java.util.List;

public interface TimeslotService {
    TimeslotDto createTimeslot(TimeslotDto timeslotDto);

    List<TimeslotDto> getAllTimeslot();

    TimeslotDto getTimeslotId(String timeslotId);

    TimeslotDto updateTimeslot(TimeslotDto timeslotDto, String timeslotId);

    void deleteTimeslot(String timeslotId);
}
