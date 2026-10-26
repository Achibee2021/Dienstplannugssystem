import type { DayOfWeek, ShiftType } from "@/types/employee";
import type { Timeslot } from "@/types/timeslots";

export const DAY_LABEL: Record<DayOfWeek, string> = {
    MONDAY: "Montag",
    TUESDAY: "Dienstag",
    WEDNESDAY: "Mittwoch",
    THURSDAY: "Donnerstag",
    FRIDAY: "Freitag",
    SATURDAY: "Samstag",
    SUNDAY: "Sonntag",
};

export const DAY_LABEL_SHORT: Record<DayOfWeek, string> = {
    MONDAY: "Mo",
    TUESDAY: "Di",
    WEDNESDAY: "Mi",
    THURSDAY: "Do",
    FRIDAY: "Fr",
    SATURDAY: "Sa",
    SUNDAY: "So",
};

export const SHIFT_LABEL: Record<ShiftType, string> = {
    FRUESCHICHT: "Früschicht",
    SPAETSCHICHT: "Spätschicht",
    NACHTSCHICHT: "Nachtschicht",
    
};

export const SHIFT_EMOJI: Record<ShiftType, string> = {
    FRUESCHICHT: "🌅",
    SPAETSCHICHT: "☀️",
    NACHTSCHICHT: "🌙",
   
};


export function timeslotLabel(t: Timeslot): string {
    return `${DAY_LABEL_SHORT[t.dayOfWeek]} ${t.startTime.slice(0,5)}–${t.endTime.slice(0,5)} (${SHIFT_LABEL[t.type]})`;
}