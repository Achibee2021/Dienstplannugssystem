import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateAssignment } from "@/hooks/assignments/useCreateAssignments";
import { useUpdateAssignment } from "@/hooks/assignments/useUpdateAssignments";
import { useEmployees } from "@/hooks/employees/useEmployees";
import { useStations } from "@/hooks/stations/useStations";
import { useTimeslots } from "@/hooks/timslots/useTimeslots";
import type { Assignment } from "@/types/assignment";
import { useState } from "react";
import { timeslotLabel } from "../weekly-plan/labels";
import type { DayOfWeek } from "@/types/employee";




type Props = {
    open: boolean;
    assignment: Assignment | null;
    onClose: () => void;
    onSaved: () => void;
}

export function AssignmentFormDialog({open, assignment, onClose, onSaved}: Props){
    const DAY_ORDER: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

    const isEdit = assignment !==null;

    const [id, setID] = useState(() => assignment?.id ?? `assign-${Date.now()}`);
    const [stationId, setStationId] = useState(() => assignment?.station.id ?? "");
    const [timeslotId, setTimeslotId] = useState(() => assignment?.timeslot.id ?? "");
    const [employeeId, setEmployeeId] = useState(() => assignment ? assignment.employee ? assignment.employee.id : null : null);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createMutation = useCreateAssignment();
    const updateMutation = useUpdateAssignment();
    const {data: stations} = useStations();
    const {data: timeslots} = useTimeslots();
    const {data: employees} = useEmployees();


    const getDaysIndex = (day: DayOfWeek) => {
        const index = DAY_ORDER.indexOf(day);
        return index === -1 ? 99 : index;
    }
    const sortedTimeslots = timeslots ? [...timeslots].sort((a, b) => {
        const dayDiff = getDaysIndex(a.dayOfWeek) - getDaysIndex(b.dayOfWeek);
        if (dayDiff !== 0) return dayDiff;

        return a.startTime.localeCompare(b.startTime);
    }) : [];   

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if(submitting) return;
        setError(null);

        if(!stationId) {setError("Station ist erforderlich."); return;}
        if(!timeslotId) {setError("Timeslot ist erforderlich."); return;}

        const station = stations ? stations.find((s) => s.id === stationId) : null;
        const timeslot =timeslots ? timeslots.find((t) => t.id === timeslotId) : null;
        const employee = employees ? employeeId ? employees.find((e) => e.id === employeeId) ?? 
        null : null : null;

        if (!station || !timeslot) {
            setError("Ungültige Auswahl.")
            return;
        }


        const payload: Assignment = {
            id: id.trim() || `assign-${Date.now()}`,
            employee,
            station,
            timeslot,
        };

        setSubmitting(true);
            try {
                if (isEdit) {
                    await updateMutation.mutateAsync({id: assignment.id, assignment: payload});
                } else {
                    await createMutation.mutateAsync(payload);
                }
                onSaved();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Fehler beim Speichern.")
            } finally {
                setSubmitting(false)
            }
    };

    

    return (
        <Dialog open={open} onOpenChange={(o) => {if (!o) onClose(); }}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Assignment bearbeiten" :"Neuer Assignment"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">ID</label>
                        <Input 
                            value={id}
                            onChange={(a) => setID(a.target.value)}
                            disabled={isEdit}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Zeit</label>
                        <Select value={timeslotId} onValueChange={(v) => setTimeslotId(v ?? "")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Zeitslot wählen" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortedTimeslots?.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>
                                        {timeslotLabel(t)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Station</label>
                        <Select value={stationId} onValueChange={(v) => setStationId(v ?? "")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Station wählen" />
                            </SelectTrigger>
                            <SelectContent>
                                {stations?.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Mitarbeiter</label>
                        <Select value={employeeId ?? "none"} onValueChange={(v) => setEmployeeId(v === "none" ? null : v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">- Nicht zugewiesen -</SelectItem>
                                {employees?.map((e) => (
                                    <SelectItem key={e.id} value={e.id}>
                                        {e.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    
                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <DialogFooter>
                        <div className="flex justify-end gap-2 pt-4">
                            <button 
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                            >Abbrechen</button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                {submitting ? "Speichern...": "Speichern"}</button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}