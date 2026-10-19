import type { Assignment } from "@/types/assignment";
import type { Timeslot } from "@/types/timeslots";
import { sortDays, type EmployeeGridCell, type EmployeeGridModel, type EmployeeGridRow } from "../types";
import type { Employee } from "@/types/employee";

export function buildEmployeeGridModel(
    assignments: Assignment[],
    timeslots: Timeslot[],
): EmployeeGridModel {
    if (!timeslots || timeslots.length === 0) {
        return {days: [], employees: [], rows: []};
    }

    const rawDays = Array.from(new Set(timeslots.map((t) => t.dayOfWeek)));
    const days = sortDays(rawDays);

    const employeeMap = new Map<string, Employee>();
    assignments.forEach((a) => {
        if (a.employee && !employeeMap.has(a.employee.id)) {
            employeeMap.set(a.employee.id, a.employee);
        }
    });
    const employees = Array.from(employeeMap.values()).sort((a,b)=>
    a.name.localeCompare(b.name));

    const rows: EmployeeGridRow[] = employees.map((employee) => {
        const employeeAssignments = assignments.filter(
            (a) => a.employee?.id === employee.id
        );

        const cells: EmployeeGridCell[] = days.map((day) => {
            const dayAssignments = employeeAssignments.filter(
                (a) => a.timeslot.dayOfWeek === day
            );
            return {
                day,
                employee,
                assignments: dayAssignments,
            };
        });
        return {employee, cells}
    });

    return {days, employees, rows};
}