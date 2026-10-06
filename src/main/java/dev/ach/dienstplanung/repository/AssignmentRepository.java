package dev.ach.dienstplanung.repository;

import dev.ach.dienstplanung.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignmentRepository extends JpaRepository<Assignment, String> {
}
