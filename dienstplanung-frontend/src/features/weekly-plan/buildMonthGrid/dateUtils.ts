import type { DayOfWeek } from "@/types/employee";

const DAYS_MAP: Record<number, DayOfWeek> = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY"
};

export function getMonthDays(year: number, month: number) {
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() == month) {
        days.push({
            date: new Date(date),
            dayOfWeek: DAYS_MAP[date.getDay()],
            dayNumber: date.getDate()
        });
        date.setDate(date.getDate() + 1);
    }
    return days;
}