
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateEmployee } from "@/hooks/employees/useCreateEmployee";
import { useUpdateEmployee } from "@/hooks/employees/useUpdateEmployee";
import type { DayOfWeek, Employee, ShiftType } from "@/types/employee";
import React, { useState } from "react";
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
]

type Props = {
    open: boolean;
    employee: Employee | null;
    onClose: () => void;
    onSaved: () => void;
}

export function EmployeeFormDialog({open, employee, onClose, onSaved}: Props){
    const isEdit = employee !==null;

    const [id, setID] = useState(() => employee?.id ?? `emp-${Date.now()}`);
    const [name, setName] = useState(() => employee?.name ?? "");
    const [qualification, setQualification] = useState(() => employee?.qualification ?? "");
    const [wochenStunden, setWochenStunden] = useState(() => employee?.wochenStunden ?? 40);
    const [wunschSchicht, setWunschSchicht] = useState<ShiftType[]>(() => employee?.wunschSchicht ?? []);
    const [bevorzugtInput, setBevorzugtInput] = useState(() => (employee?.bevorzugtMitarbeiter ?? []).join(", "));
    const [wunschFreiTage, setWunschFreitage] = useState<DayOfWeek[]>(() => employee?.wunschFreiTage ?? []);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createMutation = useCreateEmployee();
    const updateMutation = useUpdateEmployee();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Name ist erforderlich.");
            return;
        }

        const payload: Employee = {
            id: id.trim() || `emp-${Date.now()}`,
            name: name.trim(),
            qualification: qualification.trim(),
            wochenStunden,
            wunschSchicht,
            bevorzugtMitarbeiter: bevorzugtInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
            wunschFreiTage,
        };

        setSubmitting(true);
            try {
                if (isEdit && employee) {
                    await updateMutation.mutateAsync({id: employee.id, employee: payload});
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
                        {isEdit ? "Mitarbeiter bearbeiten" :"Neuer Mitarbeiter"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">ID</label>
                        <Input 
                            value={id}
                            onChange={(e) => setID(e.target.value)}
                            disabled={isEdit}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ihre Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Qualifikation</label>
                        <Input 
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            placeholder="pfleger"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Wochenstunden</label>
                            <Input
                                type="number" 
                                value={wochenStunden}
                                onChange={(e) => setWochenStunden(Number(e.target.value))}
                                placeholder="Ihre Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Wunschschit</label>
                                {SHIFT_OPTIONS.map((opt) => (
                                    <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox"
                                            checked={wunschSchicht.includes(opt.value)}
                                            onChange={(e) => {
                                                setWunschSchicht((prev) =>
                                                    e.target.checked
                                                        ? [...prev, opt.value]
                                                        : prev.filter((v) => v != opt.value)
                                                );
                                            }}
                                        />
                                        {opt.label}
                                    </label>
                                ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Bevorzugt Mitarbeiter</label>
                        <Input 
                            value={bevorzugtInput}
                            onChange={(e) => setBevorzugtInput(e.target.value)}
                            placeholder="Mitarbeiter1Name, Mitarbeiter2Name, ....."
                        />
                        <p className="text-xs text-slate-500 mt-1">Mehrere Namen mit komma trennen</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Wunschfreie Tage</label>
                        <div>
                            {ALL_DAYS.map((day) => (
                                <label key={day} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox"
                                        checked={wunschFreiTage.includes(day)}
                                        onChange={(e) => {
                                            setWunschFreitage((prev) =>
                                                e.target.checked
                                                    ? [...prev, day]
                                                    : prev.filter((d) => d != day)
                                            );
                                        }}
                                    />
                                    {DAY_LABEL_SHORT[day]}
                                </label>
                            ))}
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