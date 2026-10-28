import type { Employee } from "@/types/employee";
import type { Station } from "@/types/station";
import type { Timeslot } from "@/types/timeslots";
import {describe, it, expect} from "vitest";
import { buildStationGridModel } from "./buildStationGridModel";
import type { Assignment } from "@/types/assignment";

const mondayFrüh: Timeslot = { id: "ts-mon-frueh", dayOfWeek: "MONDAY",  startTime: "06:00:00", endTime: "14:30:00", type: "FRUESCHICHT" };
const mondaySpät: Timeslot = { id: "ts-mon-spaet", dayOfWeek: "MONDAY",  startTime: "14:00:00", endTime: "22:30:00", type: "SPAETSCHICHT" };
const tuesdayFrüh: Timeslot = { id: "ts-tue-frueh", dayOfWeek: "TUESDAY",  startTime: "06:00:00", endTime: "14:30:00", type: "FRUESCHICHT" };
const wednesdayFrüh: Timeslot = { id: "ts-wed-frueh", dayOfWeek: "WEDNESDAY",  startTime: "06:00:00", endTime: "14:30:00", type: "FRUESCHICHT" };


const stationA: Station = { id: "st-1", name: "Station A", benoetigteAnzahlMitarbeiter: 1, benoetigtQualification: "Pfleger" };
const stationB: Station = { id: "st-2", name: "Station B", benoetigteAnzahlMitarbeiter: 1, benoetigtQualification:"pfleger" };

const alice: Employee = { id: "emp-1", name: "Alice Smith", wochenStunden: 40, wunschFreiTage:["MONDAY"],wunschSchicht: ["FRUESCHICHT"], bevorzugtMitarbeiter:[], qualification:"pfleger" };
const Tom: Employee = { id: "emp-2", name: "Tom Cruise", wochenStunden: 40, wunschFreiTage:["MONDAY"],wunschSchicht: ["SPAETSCHICHT"], bevorzugtMitarbeiter:[], qualification:"pfleger" };



describe("buildStationGridModel", () => {
    
    it("returns an empty model when there are no assignments", () =>{
        
        const model = buildStationGridModel([],[]);

        expect(model.days).toEqual([]);
        expect(model.shiftTypes).toEqual([]);
        expect(model.stations).toEqual([]);
        expect(model.rows).toEqual([]);
    });

    it("builds a single row and cell for one assignment", () => {

        const assignment1: Assignment = {
            id: "assign-1",
            employee: alice,
            station:stationA,
            timeslot:mondayFrüh,
        };
        const model = buildStationGridModel([assignment1],[mondayFrüh]);

        expect(model.days).toEqual(["MONDAY"]);
        expect(model.shiftTypes).toEqual(["FRUESCHICHT"]);
        expect(model.stations).toEqual([stationA]);

        expect(model.rows).toHaveLength(1);
        const row = model.rows[0];
        expect(row.shiftType).toBe("FRUESCHICHT");
        expect(row.station.id).toBe("st-1");
        expect(row.cells).toHaveLength(1);

        const cell = row.cells[0];
        expect(cell.day).toBe("MONDAY");
        expect(cell.station.id).toBe("st-1");
        expect(cell.timeslot?.id).toBe("ts-mon-frueh");
        expect(cell.assignments).toEqual([assignment1]);
    }); 

    it("build two rows sorted by station name", () => {

        const assignment1: Assignment = {
            id: "assign-1",
            employee: alice,
            station:stationA,
            timeslot:mondayFrüh,
        };

        const assignment2: Assignment = {
            id: "assign-2",
            employee: alice,
            station:stationB,
            timeslot:mondayFrüh,
        };
        const model = buildStationGridModel([assignment2, assignment1], [mondayFrüh]);
        
        expect(model.days).toEqual(["MONDAY"]);
        expect(model.shiftTypes).toEqual(["FRUESCHICHT"]);
        expect(model.stations).toEqual([stationA, stationB]);
        expect(model.rows).toHaveLength(2);
        const row1 = model.rows[0];
        const row2 = model.rows[1];
        expect(row1.station.name).toBe("Station A");
        expect(row2.station.name).toBe("Station B");
        

    }); 

    it("two rows sorted by shift type", ()=> {
        const assignment1: Assignment = {
            id: "assign-1",
            employee: alice,
            station:stationA,
            timeslot:mondayFrüh,
        };
        const assignment2: Assignment = {
            id: "assign-2",
            employee: alice,
            station:stationA,
            timeslot:mondaySpät,
        };

        const model = buildStationGridModel([assignment2, assignment1],[mondayFrüh,  mondaySpät]);
       
        expect(model.shiftTypes).toEqual(["FRUESCHICHT", "SPAETSCHICHT"]);
        expect(model.days).toEqual(["MONDAY"]);
        expect(model.stations).toEqual([stationA]);
        expect(model.rows).toHaveLength(2);

        const row1 = model.rows[0];
        const row2 = model.rows[1];
        expect(row1.shiftType).toBe("FRUESCHICHT");
        expect(row2.shiftType).toBe("SPAETSCHICHT");
    })

    it("plan with mon-wend only", ()=> {
        const assignment1: Assignment = {
            id: "assign-1",
            employee: alice,
            station:stationA,
            timeslot:mondayFrüh,
        };
        const assignment2: Assignment = {
            id: "assign-2",
            employee: alice,
            station:stationA,
            timeslot:tuesdayFrüh,
        };

        const assignment3: Assignment = {
            id: "assign-2",
            employee: alice,
            station:stationA,
            timeslot:wednesdayFrüh,
        };

        const model = buildStationGridModel([assignment2, assignment1, assignment3],[mondayFrüh,tuesdayFrüh,wednesdayFrüh]);
       
        //expect(model.shiftTypes).toEqual(["FRUESCHICHT", "SPAETSCHICHT"]);
        expect(model.days).toEqual(["MONDAY", "TUESDAY", "WEDNESDAY"]);
        //expect(model.stations).toEqual([stationA]);
        expect(model.rows).toHaveLength(1);

        const row = model.rows[0];
        expect(row.cells).toHaveLength(3);
        const cell1 = row.cells[0];
        const cell2 = row.cells[1];
        const cell3 = row.cells[2];
        expect(cell1.day).toBe("MONDAY");
        expect(cell2.day).toBe("TUESDAY");
        expect(cell3.day).toBe("WEDNESDAY");
    })

    it("groups multiple assignments into one cell when a station needs several employees", () => {
        const assignment1: Assignment = {
            id: "assign-1",
            employee: alice,
            station: stationA,
            timeslot: mondayFrüh,
        };
        const assignment2: Assignment = {
            id: "assign-2",
            employee: Tom,
            station: stationA,
            timeslot: mondayFrüh,
        };

        const model = buildStationGridModel([assignment1, assignment2],[mondayFrüh]);

        expect(model.days).toEqual(["MONDAY"]);
        expect(model.shiftTypes).toEqual(["FRUESCHICHT"]);
        expect(model.stations).toEqual([stationA]);
        expect(model.rows).toHaveLength(1);

        const row = model.rows[0];
        expect(row.cells).toHaveLength(1);

        const cell = row.cells[0];
        expect(cell.day).toBe("MONDAY");
        expect(cell.timeslot?.id).toBe("ts-mon-frueh");
        expect(cell.assignments).toHaveLength(2);
        expect(cell.assignments.map((a) => a.id)).toEqual(
            expect.arrayContaining(["assign-1", "assign-2"])
        );
    });

    it("produces an empty cell for a day without an assignment", () => {
        const assignment1: Assignment = {
            id: "assign-1",
            employee: alice,
            station: stationA,
            timeslot: mondayFrüh,
        };
        const assignment2: Assignment = {
            id: "assign-2",
            employee: alice,
            station: stationA,
            timeslot: wednesdayFrüh,
        };

        const model = buildStationGridModel([assignment1, assignment2],[mondayFrüh,tuesdayFrüh,wednesdayFrüh]);

        expect(model.days).toEqual(["MONDAY", "TUESDAY", "WEDNESDAY"]);
        expect(model.shiftTypes).toEqual(["FRUESCHICHT"]);
        expect(model.rows).toHaveLength(1);

        const row = model.rows[0];
        expect(row.cells).toHaveLength(3);

        // Monday: has assignment
        expect(row.cells[0].day).toBe("MONDAY");
        expect(row.cells[0].timeslot?.id).toBe("ts-mon-frueh");
        expect(row.cells[0].assignments).toHaveLength(1);

        // Tuesday: gap — no assignment, but the day exists in the plan
        expect(row.cells[1].day).toBe("TUESDAY");
        expect(row.cells[1].timeslot).toBeNull();
        expect(row.cells[1].assignments).toEqual([]);

        // Wednesday: has assignment
        expect(row.cells[2].day).toBe("WEDNESDAY");
        expect(row.cells[2].timeslot?.id).toBe("ts-wed-frueh");
        expect(row.cells[2].assignments).toHaveLength(1);
    });

    it("shows a day column even when no assignment covers it", () => {
        const model = buildStationGridModel(
            [],                              // no assignments at all
            [mondayFrüh, tuesdayFrüh],       // but structure exists
        );

        expect(model.days).toEqual(["MONDAY", "TUESDAY"]);
        expect(model.shiftTypes).toEqual(["FRUESCHICHT"]);
        expect(model.stations).toEqual([]);
        expect(model.rows).toEqual([]);
    });
});