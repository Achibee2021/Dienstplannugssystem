import type { Assignment } from "@/types/assignment";
import { sortDays, sortShiftTypes, type GridCell, type GridRow, type StationGridModel } from "../types";
import type { ShiftType } from "@/types/employee";
import type { Station } from "@/types/station";
import type { Timeslot } from "@/types/timeslots";

export function buildStationGridModel(
    assignments: Assignment[],
    timeslots: Timeslot[],
): StationGridModel{
    if (!timeslots || timeslots.length === 0) {
        return {
            days: [],
            shiftTypes: [],
            stations: [],
            rows: [],
        };
    }


    const rawDays = Array.from(
       new Set(timeslots.map((t)=> t.dayOfWeek))
    );

    const days = sortDays(rawDays);

    const rawShiftTypes = Array.from(
        new Set(timeslots.map((t)=> t.type))
    ) as ShiftType[];
    const shiftTypes = sortShiftTypes(rawShiftTypes);


    const stationMap = new Map<string, Station>();
    assignments.forEach((a)=> {
        if (!stationMap.has(a.station.id)) {
            stationMap.set(a.station.id, a.station);
        }
    });

    const stations = Array.from(stationMap.values()).sort((a,b) =>
    a.name.localeCompare(b.name));

    const rows: GridRow[] = [];

    for (const station of stations) {
        
        for(const shiftType of shiftTypes){
            const matchingAssignments = assignments.filter(
                (a) => a.station.id === station.id && a.timeslot.type === shiftType
            );

            if (matchingAssignments.length > 0) {
                const cells: GridCell[] = days.map((day) => {
                    const dayAssignments = matchingAssignments.filter(
                        (a) => a.timeslot.dayOfWeek === day
                    );

                    return {
                        day,
                        station, 
                        timeslot: dayAssignments[0]?.timeslot ?? null,
                        assignments: dayAssignments, 
                    };
                });
                rows.push({
                    station,
                    shiftType,
                    cells,
                });
            }
        }
        
    }
    return {
        days,
        shiftTypes,
        stations,
        rows
    };
    
};

