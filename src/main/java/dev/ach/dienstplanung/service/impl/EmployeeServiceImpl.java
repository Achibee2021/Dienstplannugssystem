package dev.ach.dienstplanung.service.impl;

import dev.ach.dienstplanung.dto.EmployeeDto;
import dev.ach.dienstplanung.entity.Employee;
import dev.ach.dienstplanung.exception.ElementNotFoundException;
import dev.ach.dienstplanung.mapper.EmployeeMapper;
import dev.ach.dienstplanung.repository.EmployeeRepository;
import dev.ach.dienstplanung.service.EmployeeService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {

        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);
        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployee() {
        List<Employee> employeeList = employeeRepository.findAll();
        return employeeList.stream().map(
                EmployeeMapper::mapToEmployeeDto
        ).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(String employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(()-> new ElementNotFoundException("Employee with given Id not found: " + employeeId));
        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    @Transactional
    public EmployeeDto updateEmployee(EmployeeDto employeeDto, String employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(()-> new ElementNotFoundException("Employee with given Id not found: " + employeeId));

        employee.setName(employeeDto.getName());
        employee.setQualification(employeeDto.getQualification());
        employee.setWochenStunden(employeeDto.getWochenStunden());
        employee.setWunschFreitage(employeeDto.getWunschFreiTage());
        employee.setWunschSchicht(employeeDto.getWunschSchicht());
        employee.setBevorzugtMitarbeiter(employeeDto.getBevorzugtMitarbeiter());
        Employee updatedEmployee = employeeRepository.save(employee);

        return EmployeeMapper.mapToEmployeeDto(updatedEmployee);
    }

    @Override
    @Transactional
    public void deleteEmployee(String employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(()-> new ElementNotFoundException("Employee with given Id not found: " + employeeId));
        try {
            employeeRepository.deleteById(employee.getId());
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Dieser Mitarbeiter kann nicht gelöcht werden, dar er noch Dienste hat.");
        }
    }
}
