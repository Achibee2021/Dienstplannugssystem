import { buildMonthGridModel } from "@/features/weekly-plan/buildMonthGrid/buildMonthGridModel";
import { buildStationGridModel } from "@/features/weekly-plan/buildStationGrid/buildStationGridModel";
import { useAssignments } from "@/hooks/assignments/useAssignments";
import { useTimeslots } from "@/hooks/timslots/useTimeslots";
import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

export default function MonthPlanPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const gridRef = useRef<HTMLDivElement>(null);

    const assignments = useAssignments();
    const timeslots = useTimeslots();

    if (assignments.isLoading || timeslots.isLoading) {
        return <div>Lade...</div>;
    }

    const stationModel = buildStationGridModel(assignments.data ?? [], timeslots.data ?? []);
    const monthModel = buildMonthGridModel(
        stationModel,
        currentDate.getFullYear(),
        currentDate.getMonth()
    );

    const exportPdf = async () => {
        if (!gridRef.current) return;

        const canvas = await html2canvas(gridRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("l", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;

        pdf.addImage(imgData, "PNG", 0, 0, newWidth, newHeight);
        pdf.save(`Dienstplan_${format(currentDate, "MMMM_yyyy", { locale: de })}.pdf`);
    };

    // --- Robust Week Builder: Generates full Mon-Sun weeks for the month view ---
    const firstDayOfMonth = monthModel.days[0];
    const lastDayOfMonth = monthModel.days[monthModel.days.length - 1];

    // Get the Monday of the week containing the first day
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    // Get the Sunday of the week containing the last day
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

    const allDaysInGrid = eachDayOfInterval({ start: startDate, end: endDate });

    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    allDaysInGrid.forEach((day, index) => {
        // If it's a Monday and the week isn't empty, push the completed week
        if (index > 0 && index % 7 === 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        // Only include days that belong to the current month for clean rendering, 
        // or keep them as null placeholders to preserve grid columns.
        currentWeek.push(isSameMonth(day, currentDate) ? day : null);
    });
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Monatsplan</h1>
                
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
                        <ChevronLeft />
                    </button>
                    <span className="font-semibold w-40 text-center">
                        {format(currentDate, "MMMM yyyy", { locale: de })}
                    </span>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
                        <ChevronRight />
                    </button>
                    
                    <button onClick={exportPdf} className="ml-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md">
                        <Download className="h-4 w-4" /> PDF Export
                    </button>
                </div>
            </div>

            {/* The Grid to be Exported */}
            <div ref={gridRef} className="bg-white p-4 rounded-lg border border-slate-200 overflow-x-auto space-y-8">
                {weeks.map((week, weekIdx) => {
                    // Find a valid date in this week to format the calendar week number (KW)
                    const validDayForKw = week.find(d => d !== null) || week[0]!;
                    
                    return (
                        <div key={weekIdx} className="min-w-max grid" style={{ gridTemplateColumns: `200px repeat(7, minmax(100px, 1fr))` }}>
                            
                            {/* Header Row for this week */}
                            <div className="border-b border-slate-200 bg-slate-50 p-2 font-bold text-sm">
                                Station / Schicht (KW {format(validDayForKw, "ww", { locale: de })})
                            </div>
                            {week.map((day, idx) => (
                                <div key={idx} className="border-b border-l border-slate-200 bg-slate-50 p-2 text-center text-xs">
                                    {day ? (
                                        <>
                                            <div className="font-semibold">{format(day, "dd.MM.")}</div>
                                            <div className="text-slate-500">{format(day, "eee", { locale: de })}</div>
                                        </>
                                    ) : (
                                        <div className="text-slate-300">-</div>
                                    )}
                                </div>
                            ))}

                            {/* Data Rows for this week */}
                            {monthModel.rows.map((row, rowIdx) => (
                                <div key={rowIdx} className="contents">
                                    <div className="border-b border-slate-200 p-2 text-sm flex flex-col justify-center">
                                        <strong>{row.station.name}</strong>
                                        <span className="text-xs text-slate-500">{row.shiftType}</span>
                                    </div>
                                    {week.map((day, cellIdx) => {
                                        if (!day) {
                                            return <div key={cellIdx} className="border-b border-l border-slate-200 bg-slate-50/50 p-1" />;
                                        }

                                        // Find the cell for this exact day
                                        const cell = row.cells.find(c => c.date.toDateString() === day.toDateString());
                                        
                                        return (
                                            <div key={cellIdx} className="border-b border-l border-slate-200 p-1 min-h-[50px]">
                                                {cell?.assignments.map(a => (
                                                    <div key={a.id} className="bg-slate-100 rounded px-1 text-[10px] truncate mb-1">
                                                        {a.employee?.name || "Offen"}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}