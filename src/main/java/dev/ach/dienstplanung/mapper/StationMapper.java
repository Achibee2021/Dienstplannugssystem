package dev.ach.dienstplanung.mapper;

import dev.ach.dienstplanung.dto.StationDto;
import dev.ach.dienstplanung.entity.Station;

public class StationMapper {

    public static StationDto mapToStationDto(Station station){
        return new StationDto(
                station.getId(),
                station.getName(),
                station.getBenoetigteAnzahlMitarbeiter(),
                station.getBenoetigtQualification()
        );
    }

    public static Station mapToStation(StationDto stationDto){
        return new Station(
                stationDto.getId(),
                stationDto.getName(),
                stationDto.getBenoetigteAnzahlMitarbeiter(),
                stationDto.getBenoetigtQualification()
        );
    }
}
