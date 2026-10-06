package dev.ach.dienstplanung.repository;

import dev.ach.dienstplanung.entity.Timeslot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeslotRepository extends JpaRepository<Timeslot, String> {
}
