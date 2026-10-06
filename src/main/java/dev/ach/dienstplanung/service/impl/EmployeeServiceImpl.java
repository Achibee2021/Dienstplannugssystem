package dev.ach.dienstplanung.service.impl;

import dev.ach.dienstplanung.dto.EmployeeDto;
import dev.ach.dienstplanung.entity.Employee;
import dev.ach.dienstplanung.exception.ElementNotFoundException;
import dev.ach.dienstplanung.mapper.EmployeeMapper;
import dev.ach.dienstplanung.repository.EmployeeRepository;
import dev.ach.dienstplanung.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private EmployeeRepository employeeRepository;

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {

        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);
        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    public List<EmployeeDto> getAllEmployee() {
        List<Employee> employeeList = employeeRepository.findAll();
        return employeeList.stream().map(
                EmployeeMapper::mapToEmployeeDto
        ).collect(Collectors.toList());
    }

    @Override
    public EmployeeDto getEmployeeById(String employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(()-> new ElementNotFoundException("Employee with given Id not found: " + employeeId));
        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    public EmployeeDto updateEmployee(EmployeeDto employeeDto, String employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(()-> new ElementNotFoundException("Employee with given Id not found: " + employeeId));

        employee.setId(employeeDto.getId());
        employee.setName(employeeDto.getName());
        employee.setQualification(employeeDto.getQualification());
        employeeDto.setWochenStunden(employeeDto.getWochenStunden());
        employeeDto.setWunschFreiTage(employeeDto.getWunschFreiTage());
        employeeDto.setWunschSchicht(employeeDto.getWunschSchicht());
        employeeDto.setBevorzugtMitarbeiter(employeeDto.getBevorzugtMitarbeiter());
        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    public void deleteEmployee(String employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(()-> new ElementNotFoundException("Employee with given Id not found: " + employeeId));
        employeeRepository.deleteById(employee.getId());
    }
}
