import type { DayOfWeek } from "@/types/employee"

type Props = {
    days: DayOfWeek[];
};

const DAY_LABEL: Record<DayOfWeek, string> = {
    MONDAY: "Mo",
    TUESDAY: "Di",
    WEDNESDAY: "Mi",
    THURSDAY: "Do",
    FRIDAY: "Fr",
    SATURDAY: "Sa",
    SUNDAY: "So",
};

export function GridHeader({days}: Props) {
    return [
        <div 
            key="__corner"
            className="border-b border-slate-200 bg-slate-50"
        />,
            ...days.map((day) => (
                <div key={day} className="border-b border-l border-slate-200 bg-slate-50 px-2
                py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 text-center">
                    {DAY_LABEL[day]}
                </div>
            )),
    ];
}