package dev.ach.dienstplanung.mapper;

import dev.ach.dienstplanung.dto.EmployeeDto;
import dev.ach.dienstplanung.entity.Employee;

public class EmployeeMapper {

    public static EmployeeDto mapToEmployeeDto(Employee employee){
        return new EmployeeDto(
                employee.getId(),
                employee.getName(),
                employee.getQualification(),
                employee.getWochenStunden(),
                employee.getWunschSchicht(),
                employee.getBevorzugtMitarbeiter(),
                employee.getWunschFreitage()
        );
    }

    public static Employee mapToEmployee(EmployeeDto employeeDto){
        return new Employee(
                employeeDto.getId(),
                employeeDto.getName(),
                employeeDto.getQualification(),
                employeeDto.getWunschSchicht(),
                employeeDto.getWochenStunden(),
                employeeDto.getBevorzugtMitarbeiter(),
                employeeDto.getWunschFreiTage()
        );
    }
}
