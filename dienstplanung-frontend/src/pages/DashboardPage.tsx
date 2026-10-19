import { solveApi } from "@/api/solveApi";
import { ScoreSummary } from "@/features/weekly-plan/ScoreSummary";
import { useAssignments } from "@/hooks/assignments/useAssignments";
import { useEmployees } from "@/hooks/employees/useEmployees";
import { useStations } from "@/hooks/stations/useStations";
import { useTimeslots } from "@/hooks/timslots/useTimeslots";
import { useSolveJob } from "@/hooks/useSolveJob";
import { Loader2, Play } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
    const JOB_ID_STORAGE_KEY = "dienstplanung.activeJoId";
    const [isLocalSolving, setIsLocalSolving] = useState(false)
    const [jobId, setJobId] = useState<string |null >(() => localStorage.getItem(JOB_ID_STORAGE_KEY));

    const employees = useEmployees();
    const stations = useStations();
    const timeslots = useTimeslots();
    const assignments = useAssignments();
    const solveJob = useSolveJob(jobId);

    const isSolving = solveJob.data?.isSolving ?? false;
    const score = solveJob.data?.score ?? null;

    const handleStartSolve = async () => {
        setIsLocalSolving(true);
        const newJobId = await solveApi.start();
        setJobId(newJobId);
        localStorage.setItem(JOB_ID_STORAGE_KEY, newJobId);
    };

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-slate-500">Übersicht über deinen aktuellen Dienstplan.</p>

            </div>
            {/** Top Section & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Optimierung</h2>
                        <p className="text-sm text-slate-500 mb-4">Starte den Timefold Solver, um die aktuellen Zuweisungen zu optimieren.</p>
                    </div>

                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={handleStartSolve}
                            disabled={isSolving || isLocalSolving}
                            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2
                            text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            {isSolving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4"/>}
                            {isSolving ? "Solver läuft..." : "Optimierung starten"}
                        </button>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500">Aktuelle Bewertung:</span>
                            <ScoreSummary score={score}/>
                        </div>
                    </div>
                </div>

                {/**Quick Stats Card */}
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Datenbestand</h2>
                    <div className="space-y-4">
                        <StatRow label="Mitarbeiter" value={employees.data?.length} loading={employees.isLoading}/>
                        <StatRow label="Stationen" value={stations.data?.length} loading={stations.isLoading}/>
                        <StatRow label="Zeitslots" value={timeslots.data?.length} loading={timeslots.isLoading}/>
                        <StatRow label="Zuweisungen" value={assignments.data?.length} loading={assignments.isLoading}/>
                    </div>
                </div>
            </div>
        </>
    )
}

function StatRow({label, value, loading}:{label: string; value?: number; loading: boolean}) {
    return(
        <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">{label}</span>
            {loading ? (
                <span className="h-5 w-8 bg-slate-100 animate-pulse rounded" />
            ): (
                <span className="text-lg font-semibold text-slate-900 tabular-nums">{value ?? 0}</span>
            )}
        </div>
    );
}