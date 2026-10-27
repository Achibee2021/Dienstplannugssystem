import { buildMonthGridModel } from "@/features/weekly-plan/buildMonthGrid/buildMonthGridModel";
import { buildStationGridModel } from "@/features/weekly-plan/buildStationGrid/buildStationGridModel";
import { useAssignments } from "@/hooks/assignments/useAssignments";
import { useTimeslots } from "@/hooks/timslots/useTimeslots";
import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import {jsPDF} from "jspdf";
import {format} from "date-fns";
import {de} from "date-fns/locale";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function MonthPlanPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const gridRef = useRef<HTMLDivElement>(null);

    const assignments = useAssignments();
    const timeslots = useTimeslots();

    if (assignments.isLoading || timeslots.isLoading) {
        return <div>Lade...</div>
    }

    const stationModel = buildStationGridModel(assignments.data ?? [], timeslots.data ?? []);
    const monthModel = buildMonthGridModel(
        stationModel,
        currentDate.getFullYear(),
        currentDate.getMonth()
    );

    const exportPdf = async () => {
        if (!gridRef.current) return;

        const canvas = await html2canvas(gridRef.current, {scale: 2});
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
        pdf.save(`Dienstplan_${format(currentDate, "MMMM_yyyy", {locale: de})}.pdf`);
    };

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    monthModel.days.forEach((day) => {

        if (day.getDay() === 1 && currentWeek.length > 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push(day);
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
                {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="min-w-max grid" style={{ gridTemplateColumns: `200px repeat(7, minmax(100px, 1fr))` }}>
                        
                        {/* Header Row for this week */}
                        <div className="border-b border-slate-200 bg-slate-50 p-2 font-bold text-sm">
                            Station / Schicht (KW {format(week[0], "ww")})
                        </div>
                        {week.map((day, idx) => (
                            <div key={idx} className="border-b border-l border-slate-200 bg-slate-50 p-2 text-center text-xs">
                                <div className="font-semibold">{format(day, "dd.MM.")}</div>
                                <div className="text-slate-500">{format(day, "eee", { locale: de })}</div>
                            </div>
                        ))}

                        {/* Data Rows for this week */}
                        {monthModel.rows.map((row, rowIdx) => (
                            <div key={rowIdx} className="contents">
                                <div className="border-b border-slate-200 p-2 text-sm">
                                    <strong>{row.station.name}</strong>
                                    <br/>
                                    <span className="text-xs text-slate-500">{row.shiftType}</span>
                                </div>
                                {week.map((day, cellIdx) => {
                                    // Find the cell for this exact day
                                    const cell = row.cells.find(c => c.date.toDateString() === day.toDateString());
                                    
                                    return (
                                        <div key={cellIdx} className="border-b border-l border-slate-200 p-1">
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
                ))}
            </div>
        </div>
    );
}