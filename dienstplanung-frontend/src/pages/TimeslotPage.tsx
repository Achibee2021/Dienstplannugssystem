import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";
import { DeleteTimeslotDialog } from "@/features/timeslots/DeleteTimeslotDialog";
import { TimeslotFormDialog } from "@/features/timeslots/TimeslotFormDialog";
import { TimeslotTable } from "@/features/timeslots/TimeslotTable";
import { useTimeslots } from "@/hooks/timslots/useTimeslots";
import type { Timeslot } from "@/types/timeslots";
import { Clock } from "lucide-react";
import { useMemo, useState } from "react";



export default function TimeslotPage(){
    const {role} = useAuth();
    const isAdmin = role === "ADMIN";
    const {data, isLoading, error} = useTimeslots();
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingTimeslot, setEditingTimeslot] = useState<Timeslot | null>(null);
    const [deletingTimeslot, setDeletingTimeslot] = useState<Timeslot | null>(null);


    const filtered = useMemo(() => {
        const list = data ?? [];
        if (!search.trim()) {
            return list;
        }
        const searchWord = search.toLowerCase();
        return list.filter((t) => 
                t.type.toLowerCase().includes(searchWord) || 
                t.dayOfWeek.toLowerCase().includes(searchWord));
    }, [data, search]);

    const handleCreate = () => {
        setEditingTimeslot(null);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingTimeslot(null);
    };

    const handleEdit = (timeslot: Timeslot) => {
        setEditingTimeslot(timeslot);
        setFormOpen(true);
    };

    const handleDelete = (timeslot: Timeslot) => {
        setDeletingTimeslot(timeslot);
        
    }

    if(isLoading) {
        return (
            <>
                <PageHeader onCreate={handleCreate}/>
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Lade Timeslot...
                </div>
            </>
        );
    }
    if(error) {
        return (
            <>
                <PageHeader onCreate={handleCreate}/>
                <div className="rounded-lg border  border-red-200 bg-red-50 p-8 text-center text-red-700">
                    Fehler beim Laden: {String(error)}
                </div>
            </>
        );
    }
    return (
        <>
            <PageHeader onCreate={handleCreate}/>
            <div className="mb-4">
                <Input 
                    placeholder="Suchen..."
                    value={search}
                    onChange={(t) => setSearch(t.target.value)}
                    className="max-w-xs"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-12 text-center
                 flex flex-col items-center justify-center">
                    <Clock className="h-10 w-10 text-slate-300 mb-4"/>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">
                        {search
                        ? "Keine Zeitslot gefunden"
                        : "Noch keine Zeitslot. Lege den ersten an."}
                    </h3>
                    <p>
                        {search
                            ? "Versuche es mit einem anderen Suchbegriff."
                            : "Füge deinen ersten Zeitslot hinzu, um mit der Planung zu beginnen."}
                    </p>
                    {!search && isAdmin && (
                        <button onClick={handleCreate} className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                            + Neu
                        </button>
                    )}
                </div>
            ) : (
                <TimeslotTable timeslots={filtered} onEdit={handleEdit} onDelete={handleDelete}/>
            )}
            <TimeslotFormDialog key={`${editingTimeslot?.id ?? "new"}-${formOpen}`} open={formOpen} timeslot={editingTimeslot} onClose={handleCloseForm} onSaved={handleCloseForm} />
            <DeleteTimeslotDialog timeslot={deletingTimeslot} onClose={() => setDeletingTimeslot(null)}/>

        </>
    );
}

function PageHeader({onCreate}: {onCreate: () => void}) {
    const {role} = useAuth();
    const isAdmin = role === "ADMIN";
   
    return (
        <div className="flex items-center justify-between mb-4 gap-3">
            <div>
                <h1 className="text-2xl font-bold">Timeslot</h1>
                <p className="text-sm text-slate-500">Verwalte die Timeslot deines Dienstplans.</p>
            </div>
            {isAdmin && (<button
                type="button"
                onClick={onCreate}
                className="inline-flex items-center gap-2 rounded-md bg-slate-900
                px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
                + Neu
            </button>)}
        </div>
    );
}