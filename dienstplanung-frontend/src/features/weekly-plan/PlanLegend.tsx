const SHIFTS = [
    {emoji: "🌅", label:"Früschicht"},
    {emoji: "☀️", label:"Spätschicht"},
    {emoji: "🌙", label:"Nachtschicht"},
];

export function PlanLegend() {
    return (
        <div className="flex flex-wrap items-center
        gap-x-6 gap-y-2 text-xs text-slate-500 mt-4
        ">
            {SHIFTS.map((s)=> (
                <span key={s.label} className="flex items-center gap-1.5">
                    <span className="text-sm">{s.emoji}</span>
                    {s.label}
                </span>
            ))}

            <span className="flex items-center gap-1.5">
                <span className="inline-block w-1 h-3 rounded-full bg-slate-400" />
                Farbe = Station
            </span>

            <span className="flex items-center gap-1.5">
                <span className="inline-block border border-dashed border-b-amber-400
                rounded px-1 text-amber-700 text-[10px] italic">
                    Nicht zugewiesen
                </span>
                Solver konnte nicht bestzen
            </span>

            <span className="flex items-center gap-1.5">
                <span className="text-slate-300">-</span>
                Keine Zuweisung
            </span>
        </div>
    );
}