package dev.ach.dienstplanung.repository;

import dev.ach.dienstplanung.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, String> {
}
