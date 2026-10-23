CREATE TABLE app_user (
      id BIGSERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      enabled BOOLEAN NOT NULL DEFAULT TRUE
);