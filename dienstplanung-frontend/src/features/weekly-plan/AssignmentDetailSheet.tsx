import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,

 } from "@/components/ui/sheet";

import { DAY_LABEL, SHIFT_EMOJI, SHIFT_LABEL } from "./labels";
import type { Assignment } from "@/types/assignment";

 type Props = {
    assignments: Assignment[] | null;
    headerTitle: string;
    headerSubtitle: string;
    onClose: () => void;
 };

 export function AssignmentDetailSheet({assignments,headerTitle,headerSubtitle, onClose}: Props) {
    const open =assignments != null && assignments.length > 0;

    return (
        <Sheet open={open} onOpenChange={(o) => {if (!o) onClose(); }}>
            <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{headerTitle}</SheetTitle>
                    <SheetDescription>
                        {headerSubtitle}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-3">
                    {assignments?.map((a) => (
                        <div key={a.id} 
                            className="rounded-lg border border-slate-200
                            bg-white p-3 space-y-2">
                                <div>
                                    <div className="text-xs uppercase tracking-wide
                                    text-slate-500">
                                        Mitarbeiter
                                    </div>
                                    {a.employee ? (
                                        <>
                                            <div className="text-sm font-medium
                                            text-slate-800">
                                                {a.employee.name}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {a.employee.qualification}
                                            </div>
                                        </>
                                    ): (
                                        <div className="text-sm text-amber-700">
                                            Nicht zugewiesen.
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="text-xs uppercase tracking-wide
                                    text-slate-500">
                                        Station
                                    </div>
                                    <div className="text-sm text-slate-800">
                                        {a.station.name}
                                    </div>
                                </div>

                                {a.timeslot && (
                                    <div>
                                        <div className="text-xs uppercase tracking-wide
                                        text-slate-500">
                                            Zeitslot
                                        </div>
                                        <div>
                                            {DAY_LABEL[a.timeslot.dayOfWeek]}
                                            {" . "}
                                            {SHIFT_EMOJI[a.timeslot.type]} {SHIFT_LABEL[a.timeslot.type]}
                                            {" . "}
                                            {a.timeslot.startTime.slice(0,5)}-
                                            {a.timeslot.endTime.slice(0,5)}
                                        </div>
                                    </div>
                                )}
                            </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
 }