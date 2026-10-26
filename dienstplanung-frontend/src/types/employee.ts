export type ShiftType = "FRUESCHICHT" | "SPAETSCHICHT" | "NACHTSCHICHT";
export type DayOfWeek = "MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|"SUNDAY";

export interface Employee{
    id: string;
    name: string;
    qualification: string;
    wochenStunden: number;
    wunschSchicht: ShiftType[];
    bevorzugtMitarbeiter: string[];
    wunschFreiTage: DayOfWeek[];
}