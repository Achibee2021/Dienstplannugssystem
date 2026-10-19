import { Loader2, Play, Square } from "lucide-react";

type Props = {
    isSolving: boolean;
    onStart: () => void;
    onStop: () => void;
};

export function SolveButton({isSolving, onStart, onStop}:Props) {
    if (isSolving) {
        return (
            <button
                type="button"
                onClick={onStop}
                className="inline-flex items-center gap-2 rounded-md bg-red-600
                px-4 py-2 text-sm font-medium text-white hover:bg-red-700
                transition-colors"
            >
                <Square className="h-4 w-4"/>
                Stoppen
                <Loader2 className="h-4 w-4 animate-spin"/>
            </button>
        );
    }
    
    return (
        <button 
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600
            px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
            <Play className="h-4 w-4"/>
            Optimierung starten
        </button>
    );
}