import { describe, it, expect } from "vitest";
import { buildEmployeeGridModel } from "./buildEmployeeGridModel";
import type { Assignment } from "@/types/assignment";
import type { Employee } from "@/types/employee";
import type { Station } from "@/types/station";
import type { Timeslot } from "@/types/timeslots";


// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const employeeA: Employee = {
    id: "emp-1",
    name: "Alice Smith",
    qualification: "Pfleger",
    wochenStunden: 40,
    wunschSchicht: ["FRUESCHICHT"],
    bevorzugtMitarbeiter: [],
    wunschFreiTage: [],
};

const employeeB: Employee = {
    id: "emp-2",
    name: "Bob Jones",
    qualification: "Arzt",
    wochenStunden: 40,
    wunschSchicht: ["SPAETSCHICHT"],
    bevorzugtMitarbeiter: [],
    wunschFreiTage: [],
};

const station: Station = {
    id: "st-1",
    name: "Station A",
    benoetigteAnzahlMitarbeiter: 1,
    benoetigtQualification: "Pfleger",
};

const mondayFrueh: Timeslot = {
    id: "ts-mon-frueh",
    dayOfWeek: "MONDAY",
    startTime: "06:00:00",
    endTime: "14:30:00",
    type: "FRUESCHICHT",
    crossesMidnight: false,
};

const mondaySpaet: Timeslot = {
    id: "ts-mon-spaet",
    dayOfWeek: "MONDAY",
    startTime: "14:00:00",
    endTime: "22:30:00",
    type: "SPAETSCHICHT",
    crossesMidnight: false,
};

const tuesdayFrueh: Timeslot = {
    id: "ts-tue-frueh",
    dayOfWeek: "TUESDAY",
    startTime: "06:00:00",
    endTime: "14:30:00",
    type: "FRUESCHICHT",
    crossesMidnight: false,
};

const wednesdayFrueh: Timeslot = {
    id: "ts-wed-frueh",
    dayOfWeek: "WEDNESDAY",
    startTime: "06:00:00",
    endTime: "14:30:00",
    type: "FRUESCHICHT",
    crossesMidnight: false,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("buildEmployeeGridModel", () => {
    it("returns an empty model when there are no assignments", () => {
        const model = buildEmployeeGridModel([], []);

        expect(model.days).toEqual([]);
        expect(model.employees).toEqual([]);
        expect(model.rows).toEqual([]);
    });

    it("returns empty days if timeslots are empty, even with assignments", () => {
        const assignment: Assignment = {
            id: "assign-1",
            employee: employeeA,
            station: station,
            timeslot: mondayFrueh,
        };

        // Passing empty array for timeslots
        const model = buildEmployeeGridModel([assignment], []);

        expect(model.days).toEqual([]);
        expect(model.employees).toEqual([]);
        expect(model.rows).toEqual([]);
    });

    it("builds a single row and cell for one assignment", () => {
        const assignment: Assignment = {
            id: "assign-1",
            employee: employeeA,
            station: station,
            timeslot: mondayFrueh,
        };

        const model = buildEmployeeGridModel([assignment], [mondayFrueh]);

        expect(model.days).toEqual(["MONDAY"]);
        expect(model.employees).toEqual([employeeA]);
        expect(model.rows).toHaveLength(1);

        const row = model.rows[0];
        expect(row.employee.id).toBe("emp-1");
        expect(row.cells).toHaveLength(1);

        const cell = row.cells[0];
        expect(cell.day).toBe("MONDAY");
        expect(cell.employee.id).toBe("emp-1");
        expect(cell.assignments).toHaveLength(1);
        expect(cell.assignments[0].id).toBe("assign-1");
    });

    it("sorts multiple employees alphabetically by name", () => {
        const assignmentA: Assignment = {
            id: "assign-1",
            employee: employeeA, // Alice
            station: station,
            timeslot: mondayFrueh,
        };
        const assignmentB: Assignment = {
            id: "assign-2",
            employee: employeeB, // Bob
            station: station,
            timeslot: mondayFrueh,
        };

        // Pass Bob first, Alice second to test sorting
        const model = buildEmployeeGridModel([assignmentB, assignmentA], [mondayFrueh]);

        expect(model.employees[0].name).toBe("Alice Smith");
        expect(model.employees[1].name).toBe("Bob Jones");
        expect(model.rows[0].employee.name).toBe("Alice Smith");
        expect(model.rows[1].employee.name).toBe("Bob Jones");
    });

    it("sorts days chronologically (Mon-Wed)", () => {
        const assignment1: Assignment = {
            id: "a1",
            employee: employeeA,
            station: station,
            timeslot: wednesdayFrueh,
        };
        const assignment2: Assignment = {
            id: "a2",
            employee: employeeA,
            station: station,
            timeslot: mondayFrueh,
        };
        const assignment3: Assignment = {
            id: "a3",
            employee: employeeA,
            station: station,
            timeslot: tuesdayFrueh,
        };

        const model = buildEmployeeGridModel(
            [assignment1, assignment2, assignment3],
            [wednesdayFrueh, mondayFrueh, tuesdayFrueh]
        );

        expect(model.days).toEqual(["MONDAY", "TUESDAY", "WEDNESDAY"]);
        expect(model.rows).toHaveLength(1);
        expect(model.rows[0].cells).toHaveLength(3);
    });

    it("groups multiple shifts on the same day into one cell", () => {
        const morningShift: Assignment = {
            id: "assign-mon-morning",
            employee: employeeA,
            station: station,
            timeslot: mondayFrueh,
        };
        const eveningShift: Assignment = {
            id: "assign-mon-evening",
            employee: employeeA,
            station: station,
            timeslot: mondaySpaet,
        };

        const model = buildEmployeeGridModel(
            [morningShift, eveningShift],
            [mondayFrueh, mondaySpaet]
        );

        expect(model.days).toEqual(["MONDAY"]);
        expect(model.rows).toHaveLength(1);
        
        const row = model.rows[0];
        expect(row.cells).toHaveLength(1); // Only 1 day column
        
        const mondayCell = row.cells[0];
        expect(mondayCell.assignments).toHaveLength(2); // Both shifts in one cell
        expect(mondayCell.assignments.map(a => a.id)).toEqual(
            expect.arrayContaining(["assign-mon-morning", "assign-mon-evening"])
        );
    });

    it("produces empty cells for days the employee is not working", () => {
        const assignment: Assignment = {
            id: "assign-1",
            employee: employeeA,
            station: station,
            timeslot: mondayFrueh,
        };

        // We provide timeslots for Mon and Wed, but Alice only works Mon
        const model = buildEmployeeGridModel(
            [assignment], 
            [mondayFrueh, wednesdayFrueh]
        );

        expect(model.days).toEqual(["MONDAY", "WEDNESDAY"]);
        expect(model.rows).toHaveLength(1);

        const row = model.rows[0];
        expect(row.cells).toHaveLength(2);

        // Monday has the shift
        expect(row.cells[0].day).toBe("MONDAY");
        expect(row.cells[0].assignments).toHaveLength(1);

        // Wednesday is empty for Alice
        expect(row.cells[1].day).toBe("WEDNESDAY");
        expect(row.cells[1].assignments).toHaveLength(0);
    });

    it("ignores unassigned shifts (employee is null)", () => {
        const unassignedShift: Assignment = {
            id: "assign-empty",
            employee: null, // Unassigned
            station: station,
            timeslot: mondayFrueh,
        };

        const model = buildEmployeeGridModel([unassignedShift], [mondayFrueh]);

        // Since no one is assigned, there are no employee rows
        expect(model.employees).toEqual([]);
        expect(model.rows).toEqual([]);
        expect(model.days).toEqual(["MONDAY"]); // Day still exists based on timeslot
    });
});