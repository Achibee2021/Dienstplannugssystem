package dev.ach.dienstplanung.auth;

public record LoginResponse (String accessToken, String role, String username) {
}
