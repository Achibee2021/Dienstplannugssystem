import { Input } from "@/components/ui/input";
import { AssignmentFormDialog } from "@/features/assignments/AssignmentFormDialog";
import { AssignmentTable } from "@/features/assignments/AssignmentTable";
import { DeleteAssignmentDialog } from "@/features/assignments/DeleteAssignmentDialog";
import { useAuth } from "@/features/auth/AuthContext";
import { useAssignments } from "@/hooks/assignments/useAssignments";
import type { Assignment } from "@/types/assignment";
import { LinkIcon } from "lucide-react";
import { useMemo, useState } from "react";



export default function AssignmentPage(){
    const {role} = useAuth();
    const isAdmin = role === "ADMIN";
    const {data, isLoading, error} = useAssignments();
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
    const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);


    const filtered = useMemo(() => {
        const list = data ?? [];
        if (!search.trim()) {
            return list;
        }
        const searchWord = search.toLowerCase();
        return list.filter((e) => 
                e.employee?.name.toLowerCase().includes(searchWord) || 
                e.station.name.toLowerCase().includes(searchWord) ||
                e.timeslot.dayOfWeek.toLowerCase().includes(searchWord));
    }, [data, search]);

    const handleCreate = () => {
        setEditingAssignment(null);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingAssignment(null);
    };

    const handleEdit = (assignment: Assignment) => {
        setEditingAssignment(assignment);
        setFormOpen(true);
    };

    const handleDelete = (assignment: Assignment) => {
        setDeletingAssignment(assignment);
        
    }

    if(isLoading) {
        return (
            <>
                <PageHeader onCreate={handleCreate}/>
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Lade Assignments...
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
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xs"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-12 text-center
                 flex flex-col items-center justify-center">
                    <LinkIcon className="h-10 w-10 text-slate-300 mb-4"/>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">
                        {search
                        ? "Keine Assignment gefunden"
                        : "Noch keine Assignment. Lege den ersten an."}
                    </h3>
                    <p>
                        {search
                            ? "Versuche es mit einem anderen Suchbegriff."
                            : "Füge deinen ersten Assignment hinzu, um mit der Planung zu beginnen oder starten Sie den Solver."}
                    </p>
                    {!search && isAdmin &&(
                        <button onClick={handleCreate} className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                            + Neu
                        </button>
                    )}
                </div>
            ) : (
                <AssignmentTable asignments={filtered} onEdit={handleEdit} onDelete={handleDelete}/>
            )}
            <AssignmentFormDialog key={`${editingAssignment?.id ?? "new"}-${formOpen}`} open={formOpen} assignment={editingAssignment} onClose={handleCloseForm} onSaved={handleCloseForm} />
            <DeleteAssignmentDialog assignment={deletingAssignment} onClose={() => setDeletingAssignment(null)}/>

        </>
    );
}

function PageHeader({onCreate}: {onCreate: () => void}) {
    const {role} = useAuth();
    const isAdmin = role === "ADMIN";
   
    return (
        <div className="flex items-center justify-between mb-4 gap-3">
            <div>
                <h1 className="text-2xl font-bold">Assignment</h1>
                <p className="text-sm text-slate-500">Verwalte die Assignment deines Dienstplans.</p>
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