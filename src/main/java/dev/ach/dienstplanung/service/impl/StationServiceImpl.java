package dev.ach.dienstplanung.service.impl;

import dev.ach.dienstplanung.dto.StationDto;
import dev.ach.dienstplanung.entity.Station;
import dev.ach.dienstplanung.exception.ElementNotFoundException;
import dev.ach.dienstplanung.mapper.StationMapper;
import dev.ach.dienstplanung.repository.StationRepository;
import dev.ach.dienstplanung.service.StationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class StationServiceImpl implements StationService {

    private StationRepository stationRepository;
    @Override
    public StationDto createStation(StationDto stationDto) {

        Station station = StationMapper.mapToStation(stationDto);
        Station savedStation = stationRepository.save(station);
        return StationMapper.mapToStationDto(savedStation);
    }

    @Override
    public StationDto getStationById(String stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(()-> new ElementNotFoundException("Station with given Id not found: " + stationId));
        return StationMapper.mapToStationDto(station);
    }

    @Override
    public List<StationDto> getAllStation() {
        List<Station> stationList = stationRepository.findAll();
        return stationList.stream().map(
                StationMapper::mapToStationDto
        ).collect(Collectors.toList());
    }

    @Override
    public StationDto updateStation(StationDto stationDto, String stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(()-> new ElementNotFoundException("Station with given Id not found: " + stationId));

        station.setId(stationDto.getId());
        station.setName(stationDto.getName());
        station.setBenoetigteAnzahlMitarbeiter(stationDto.getBenoetigteAnzahlMitarbeiter());
        station.setBenoetigtQualification(stationDto.getBenoetigtQualification());

        Station updatedStation = stationRepository.save(station);
        return StationMapper.mapToStationDto(updatedStation);
    }

    @Override
    public void deleteStation(String stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(()-> new ElementNotFoundException("Station with given Id not found: " + stationId));

        stationRepository.deleteById(station.getId());

    }
}
