package dev.ach.dienstplanung.dto;

public record ValidateMoveRequest(
        String assignmentId,
        String targetEmployeeId
        //String stationId,
        //String timeslotId
) {
}
