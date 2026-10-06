package dev.ach.dienstplanung.service;

import dev.ach.dienstplanung.dto.StationDto;

import java.util.List;

public interface StationService {
    StationDto createStation(StationDto stationDto);

    StationDto getStationById(String stationId);

    List<StationDto> getAllStation();

    StationDto updateStation(StationDto stationDto, String stationId);

    void deleteStation(String stationId);
}
