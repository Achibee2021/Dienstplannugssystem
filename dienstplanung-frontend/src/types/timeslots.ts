import type { DayOfWeek, ShiftType } from "./employee";

export interface Timeslot {
    id: string;
    dayOfWeek:DayOfWeek;
    startTime: string;
    endTime: string;
    type: ShiftType;
    crossesMidnight?: boolean;
}