package dev.ach.dienstplanung.service;

import dev.ach.dienstplanung.planning.Schedule;

public interface ScheduleWriterService {
    void writeBack(Schedule solvedSchedule);
}
