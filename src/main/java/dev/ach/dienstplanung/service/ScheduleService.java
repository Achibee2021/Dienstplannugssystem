package dev.ach.dienstplanung.service;

import dev.ach.dienstplanung.dto.ScheduleResponse;
import dev.ach.dienstplanung.planning.Schedule;

public interface ScheduleService {
    Schedule load();

}
