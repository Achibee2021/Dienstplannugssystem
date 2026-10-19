import { Loader2 } from "lucide-react";

export function SolveProgress() {
    return (
        <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600"/>
            Solver läuft...
        </div>
    );
}