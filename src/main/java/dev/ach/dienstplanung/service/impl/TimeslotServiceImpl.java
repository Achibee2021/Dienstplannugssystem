package dev.ach.dienstplanung.service.impl;

import dev.ach.dienstplanung.dto.TimeslotDto;
import dev.ach.dienstplanung.entity.Timeslot;
import dev.ach.dienstplanung.exception.ElementNotFoundException;
import dev.ach.dienstplanung.mapper.TimeslotMapper;
import dev.ach.dienstplanung.repository.TimeslotRepository;
import dev.ach.dienstplanung.service.TimeslotService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TimeslotServiceImpl implements TimeslotService {

    private TimeslotRepository timeslotRepository;
    @Override
    public TimeslotDto createTimeslot(TimeslotDto timeslotDto) {

        Timeslot timeslot = TimeslotMapper.mapToTimeslot(timeslotDto);
        Timeslot savedTimeslot = timeslotRepository.save(timeslot);
        return TimeslotMapper.matToTimeslotDto(savedTimeslot);
    }

    @Override
    public List<TimeslotDto> getAllTimeslot() {
        List<Timeslot> timeslotList = timeslotRepository.findAll();
        return timeslotList.stream().map(
                TimeslotMapper::matToTimeslotDto
        ).collect(Collectors.toList());
    }

    @Override
    public TimeslotDto getTimeslotId(String timeslotId) {
        Timeslot timeslot = timeslotRepository.findById(timeslotId)
                .orElseThrow(()-> new ElementNotFoundException("Timeslot with given Id not found: " + timeslotId));
        return TimeslotMapper.matToTimeslotDto(timeslot);
    }

    @Override
    public TimeslotDto updateTimeslot(TimeslotDto timeslotDto, String timeslotId) {
        Timeslot timeslot =timeslotRepository.findById(timeslotId)
                .orElseThrow(()-> new ElementNotFoundException("Timeslot with given Id not found: " + timeslotId));

        timeslot.setId(timeslotDto.getId());
        timeslot.setDayOfWeek(timeslotDto.getDayOfWeek());
        timeslot.setStartTime(timeslotDto.getStartTime());
        timeslot.setEndTime(timeslotDto.getEndTime());
        timeslot.setType(timeslotDto.getType());

        Timeslot updatedTimeslot = timeslotRepository.save(timeslot);

        return TimeslotMapper.matToTimeslotDto(updatedTimeslot);
    }

    @Override
    public void deleteTimeslot(String timeslotId) {

        Timeslot timeslot = timeslotRepository.findById(timeslotId)
                .orElseThrow(()-> new ElementNotFoundException("Timeslot with given Id not found: " + timeslotId));

        timeslotRepository.deleteById(timeslot.getId());
    }
}
