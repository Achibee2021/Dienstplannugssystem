package dev.ach.dienstplanung.dto;

import ai.timefold.solver.core.api.score.HardSoftScore;
import dev.ach.dienstplanung.planning.Schedule;

import java.util.UUID;

public record ScheduleResponse(
        UUID jobId,
        Schedule schedule,
        HardSoftScore score,
        boolean isSolving
) {
}
