import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTimeslot } from "@/hooks/timslots/useCreateTimeslot";
import { useUpdateTimeslot } from "@/hooks/timslots/useUpdateTimeslot";
import type { DayOfWeek, ShiftType } from "@/types/employee";
import type { Timeslot } from "@/types/timeslots";
import { useState } from "react";
import { DAY_LABEL_SHORT } from "../weekly-plan/labels";

const ALL_DAYS: DayOfWeek[] = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
];

const SHIFT_OPTIONS: {value: ShiftType, label: string}[] = [
    {value: "FRUESCHICHT", label: "Früschicht"},
    {value: "SPAETSCHICHT", label: "Spätschicht"},
    {value: "NACHTSCHICHT", label: "Nachtschicht"},
    {value: "TAGESSCHICHT", label: "Tagesschicht"},
]

type Props = {
    open: boolean;
    timeslot: Timeslot | null;
    onClose: () => void;
    onSaved: () => void;
}

export function TimeslotFormDialog({open, timeslot, onClose, onSaved}: Props){
    const isEdit = timeslot !==null;

    const [id, setID] = useState(() => timeslot?.id ?? `ts-${Date.now()}`);
    const [startTime, setStartTime] = useState(() => timeslot?.startTime ?? "");
    const [endTime, setendTime] = useState(() => timeslot?.endTime ?? "");
    const [shiftType, setShiftType] = useState<ShiftType>(() => timeslot?.type ?? "FRUESCHICHT");
    const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(() => timeslot?.dayOfWeek ?? "MONDAY");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createMutation = useCreateTimeslot();
    const updateMutation = useUpdateTimeslot();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError(null);

        const payload: Timeslot = {
            id: id.trim() || `ts-${Date.now()}`,
            startTime: startTime.trim(),
            endTime: endTime.trim(),
            type: shiftType,
            dayOfWeek: dayOfWeek,
        };

        setSubmitting(true);
            try {
                if (isEdit && timeslot) {
                    await updateMutation.mutateAsync({id: timeslot.id, timeslot: payload});
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
                        {isEdit ? "Timeslot bearbeiten" :"Neuer Timeslot"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">ID</label>
                        <Input 
                            value={id}
                            onChange={(t) => setID(t.target.value)}
                            disabled={isEdit}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">StartTime</label>
                            <Input 
                                value={startTime}
                                onChange={(t) => setStartTime(t.target.value)}
                                placeholder="startTime:08:00:00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">EndTime</label>
                            <Input 
                                value={endTime}
                                onChange={(t) => setendTime((t.target.value))}
                                placeholder="endTime: 16:00:00"
                            />
                        </div>
                        
                    </div>
                
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">ShiftType</label>
                            <Select value={shiftType} onValueChange={(v) => setShiftType(v as ShiftType)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SHIFT_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">DayOfWeek</label>
                            <Select value={dayOfWeek} onValueChange={(v) => setDayOfWeek(v as DayOfWeek)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALL_DAYS.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {DAY_LABEL_SHORT[opt]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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