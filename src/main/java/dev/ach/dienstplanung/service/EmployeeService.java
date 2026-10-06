package dev.ach.dienstplanung.service;

import dev.ach.dienstplanung.dto.EmployeeDto;

import java.util.List;

public interface EmployeeService {
    EmployeeDto createEmployee(EmployeeDto employeeDto);

    List<EmployeeDto> getAllEmployee();

    EmployeeDto getEmployeeById(String employeeId);

    EmployeeDto updateEmployee(EmployeeDto employeeDto, String employeeId);

    void deleteEmployee(String employeeId);
}
