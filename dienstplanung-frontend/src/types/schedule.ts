import type { Employee } from "./employee";
import type { Station } from "./station";
import type { Timeslot } from "./timeslots";
import type { Assignment } from "./assignment";


export interface Schedule {
    assignmentList: Assignment[];
    employees: Employee[];
    stations: Station[];
    timeslots: Timeslot[];
    score: HardSoftScore | null;
}

export interface HardSoftScore {
    hardScore: number;
    softScore: number;
}

export interface ScheduleResponse {
    jobId: string;
    schedule: Schedule;
    score: string | null;
    isSolving: boolean;
}