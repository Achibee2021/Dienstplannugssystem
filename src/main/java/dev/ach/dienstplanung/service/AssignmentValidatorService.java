package dev.ach.dienstplanung.service;

import dev.ach.dienstplanung.dto.ValidationResult;

public interface AssignmentValidatorService {
    ValidationResult validate(String assignmentId, String targetEmployeeId);

}
