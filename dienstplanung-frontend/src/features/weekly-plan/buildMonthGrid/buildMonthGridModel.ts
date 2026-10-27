import type { DayOfWeek } from "@/types/employee";
import type { StationGridModel } from "../types";

export type MonthCell = {
    date: Date;
    dayOfWeek: DayOfWeek;
    assignments: any[];
};

export type MonthRow = {
    shiftType: string;
    station: any;
    cells: MonthCell[];
};

export type MonthGridModel = {
    days: Date[];
    rows: MonthRow[];
};

export function buildMonthGridModel(
    stationModel: StationGridModel,
    year: number,
    month: number
): MonthGridModel {

    const date = new Date(year, month, 1);
    const days: Date[] = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    const rows: MonthRow[] = stationModel.rows.map((weekRow) => {
        const cells = days.map((d) => {

            const jsDay = d.getDay();
            const dayOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][jsDay] as DayOfWeek;

            const matchingAssignments = weekRow.cells
                .find((c) => c.day === dayOfWeek)?.assignments || [];
            
            return {
                date: d,
                dayOfWeek,
                assignments: matchingAssignments
            };
        });

        return {
            shiftType: weekRow.shiftType,
            station: weekRow.station,
            cells
        };
    });
    return {days, rows};
}