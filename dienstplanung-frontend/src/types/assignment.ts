import type { Employee } from "./employee";
import type { Station } from "./station";
import type { Timeslot } from "./timeslots";

export interface Assignment {
    id: string;
    employee: Employee | null;
    station: Station;
    timeslot: Timeslot;
}