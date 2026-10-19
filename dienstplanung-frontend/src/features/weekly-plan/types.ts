import type { Assignment } from "@/types/assignment";
import type { DayOfWeek, Employee, ShiftType } from "@/types/employee"
import type { Station } from "@/types/station";
import type { Timeslot } from "@/types/timeslots";

export type GridCell = {
    day: DayOfWeek;
    station: Station;
    timeslot: Timeslot | null;

    assignments: Assignment[];
};

export type GridRow = {
    shiftType: ShiftType;
    station: Station;
    cells: GridCell[];
};

export type StationGridModel = {
    days: DayOfWeek[];

    shiftTypes: ShiftType[];

    stations: Station[];
    rows: GridRow[];
};

export type EmployeeGridCell = {
    day: DayOfWeek;
    employee: Employee;
    assignments: Assignment[];
};

export type EmployeeGridRow = {
    employee: Employee;
    cells: EmployeeGridCell[];
};

export type EmployeeGridModel = {
    days: DayOfWeek[];
    employees: Employee[];
    rows: EmployeeGridRow[];
};

const SHIFT_TYPE_ORDER: ShiftType[] =["FRUESCHICHT", "SPAETSCHICHT", "NACHTSCHICHT"];
const DAY_ORDER: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export function sortShiftTypes(types: ShiftType[]): ShiftType[]{
    return [...types].sort((a,b)=> {
        const indexA = SHIFT_TYPE_ORDER.indexOf(a);
        const indexB = SHIFT_TYPE_ORDER.indexOf(b);

        return (indexA === -1 ? 99 : indexA ) - (indexB === -1 ? 99 : indexB);
    });
}

export function sortDays(days: DayOfWeek[]): DayOfWeek[]{
    return [...days].sort((a,b) => {
        const indexA = DAY_ORDER.indexOf(a);
        const indexB = DAY_ORDER.indexOf(b);

        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });
}