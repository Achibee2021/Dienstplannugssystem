package dev.ach.dienstplanung.repository;

import dev.ach.dienstplanung.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, String> {
}
