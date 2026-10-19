import type React from "react";

type View = "station" | "employee";

type Props = {
    view : View;
    onChange: (next: View) => void
}
export function ViewTabs ({view, onChange}: Props){


    return (
        <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5">
            <TabButton
                active={view === "station"}
                onClick={() => onChange("station")}
            >
                Station
            </TabButton>
            <TabButton 
                active={view === "employee"}
                onClick={() => onChange("employee")}
            >
                Mitarbeiter
            </TabButton>
        </div>
    );
    
}

function TabButton({
    active, onClick, children
}: {
    active: boolean,
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1 text-sm rounded transition-colors
                ${active ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
        >
            {children}
        </button>
    );
}