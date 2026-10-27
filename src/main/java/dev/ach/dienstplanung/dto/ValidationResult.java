package dev.ach.dienstplanung.dto;

public record ValidationResult(
        boolean isValid,
        String errorMessage
) {
}
