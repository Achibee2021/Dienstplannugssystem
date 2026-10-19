import type { ReactNode } from "react";
import { Sidebar } from "../Sidebar";

export function AppShell ({children}: {children: ReactNode}){
    return (
        <div className="flex h-screen bg-slate-50">
            <aside className="w-64 bg-slate-900 flex flex-col text-slate-300 shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <h1 className="text-white font-bold text-xl tracking-tight">DienstPlan</h1>
                </div>
                <Sidebar />
                <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
                    Backend: localhost:8080
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}