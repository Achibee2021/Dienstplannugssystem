import { buildStationGridModel } from "@/features/weekly-plan/buildStationGrid/buildStationGridModel";
import { PlanLegend } from "@/features/weekly-plan/PlanLegend";
import { useAssignments } from "@/hooks/assignments/useAssignments";
import { useTimeslots } from "@/hooks/timslots/useTimeslots";
import { WeeklyGrid } from "@/features/weekly-plan/WeeklyGrid";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSolveJob } from "@/hooks/useSolveJob";
import { solveApi } from "@/api/solveApi";
import { SolveProgress } from "@/features/weekly-plan/SolveProgress";
import { ScoreSummary } from "@/features/weekly-plan/ScoreSummary";
import { SolveButton } from "@/features/weekly-plan/SolveButton";
import { useSearchParams } from "react-router-dom";
import { buildEmployeeGridModel } from "@/features/weekly-plan/buildEmployeeGrid/buildEmployeeGridModel";
import { ViewTabs } from "@/features/weekly-plan/ViewTabs";
import { EmployeeGrid } from "@/features/weekly-plan/buildEmployeeGrid/EmployeeGrid";
import { useAuth } from "@/features/auth/AuthContext";

const JOB_ID_STORAGE_KEY = "dienstplanung.activeJobId";

export default function WeeklyPlanPage() {
    const {role} = useAuth();
    const canSolve = role === "ADMIN" || role === "PLANNER";

    const [params, setParams] = useSearchParams();
    const view = params.get("view") === "employee" ? "employee" : "station";

    const setView = (next: "station" | "employee") => {setParams({view: next})}

    const [jobId, setJobId] = useState<string | null>(
        () => localStorage.getItem(JOB_ID_STORAGE_KEY)
    )

    const queryClient = useQueryClient();
    const timeslots = useTimeslots();
    const assignments = useAssignments();
    const solveJob = useSolveJob(jobId);
    const invalidateRef = useRef(false);

    const isSolving = solveJob.data?.isSolving ?? false;
    const score = solveJob.data?.score ?? null;

    useEffect(() => {
        
        if(solveJob.data?.isSolving) {
                invalidateRef.current = false;
            }

        if (jobId && solveJob.data && !solveJob.data.isSolving) {

            if (!invalidateRef.current) {
                queryClient.invalidateQueries({queryKey: ["assignments"]});
                invalidateRef.current = true
            }
        }
    }, [jobId, solveJob.data?.isSolving, queryClient]);


    const handleStart = async () => {
        const newJobId = await solveApi.start();
        setJobId(newJobId);
        localStorage.setItem(JOB_ID_STORAGE_KEY, newJobId);
    };


    const handleStop = async () => {
        if (jobId) {
            await solveApi.stop(jobId);
        }
    };

    const stationModel = useMemo ( () => buildStationGridModel(
        assignments.data ?? [],
        timeslots.data ?? [],
    ), [assignments.data, timeslots.data], );

    const employeeModel =  useMemo ( () => buildEmployeeGridModel(
        assignments.data ?? [], timeslots.data ?? []),
        [assignments.data, timeslots.data],
    );


    const loading = timeslots.isLoading || assignments.isLoading;
    const error = timeslots.error || assignments.error;

    const renderHeader = () => (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Dienstplan</h1>
                <ViewTabs view={view} onChange={setView}/>
            </div>
            <div className="flex items-center gap-3">
                {isSolving && <SolveProgress />}
                <ScoreSummary score={score}/>
                {canSolve && (<SolveButton 
                    isSolving ={isSolving}
                    onStart={handleStart}
                    onStop={handleStop}
                />)}
            </div>
        </div>
    );

    if (loading) {
        return (
            <>
                {renderHeader()}
                <div className="rounded-lg border border-slate-200 bg-white
                p-8 text-center text-slate-500">
                    Lade Plan...
                </div>
            </>
        );
        
    }
    if (error) {
        return (
            <>
                {renderHeader()}
                <div className="rounded-lg border border-red-200
                bg-red-50 p-8 text-center text-red-700">
                    Fehler beim Laden: {String(error)}
                </div>
            </>
        );
    }
    
    
    

    return (
        <>
            {renderHeader()}
            {view === "station"
                ? <WeeklyGrid model={stationModel}/>
                : <EmployeeGrid model={employeeModel}/>}

            <PlanLegend />
        </>

    );
}