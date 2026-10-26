import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";
import { DeleteEmployeeDialog } from "@/features/employees/DeleteEmployeeDialog";
import { EmployeeFormDialog } from "@/features/employees/EmployeeFormDialog";
import { EmployeeTable } from "@/features/employees/EmployeeTable";
import { useEmployees } from "@/hooks/employees/useEmployees";
import type { Employee } from "@/types/employee";
import { Users } from "lucide-react";
import { useMemo, useState } from "react";


export default function EmployeePage(){
    const {role} = useAuth();
    const isAdmin = role === "ADMIN";
    const {data, isLoading, error} = useEmployees();
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);


    const filtered = useMemo(() => {
        const list = data ?? [];
        if (!search.trim()) {
            return list;
        }
        const searchWord = search.toLowerCase();
        return list.filter((e) => 
                e.name.toLowerCase().includes(searchWord) || 
                e.qualification.toLowerCase().includes(searchWord));
    }, [data, search]);

    const handleCreate = () => {
        setEditingEmployee(null);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingEmployee(null);
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setFormOpen(true);
    };

    const handleDelete = (employee: Employee) => {
        setDeletingEmployee(employee);
        
    }

    if(isLoading) {
        return (
            <>
                <PageHeader onCreate={handleCreate}/>
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Lade Mitarbeiter...
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
                    <Users className="h-10 w-10 text-slate-300 mb-4"/>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">
                        {search
                        ? "Keine Mitarbeiter gefunden"
                        : "Noch keine Mitarbeiter. Lege den ersten an."}
                    </h3>
                    <p>
                        {search
                            ? "Versuche es mit einem anderen Suchbegriff."
                            : "Füge deinen ersten Mitarbeiter hinzu, um mit der Planung zu beginnen."}
                    </p>
                    {!search && isAdmin && (
                        <button onClick={handleCreate} className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                            + Neu
                        </button>
                    )}
                </div>
            ) : (
                <EmployeeTable employees={filtered} onEdit={handleEdit} onDelete={handleDelete}/>
            )}
            <EmployeeFormDialog key={`${editingEmployee?.id ?? "new"}-${formOpen}`} open={formOpen} employee={editingEmployee} onClose={handleCloseForm} onSaved={handleCloseForm} />
            <DeleteEmployeeDialog employee={deletingEmployee} onClose={() => setDeletingEmployee(null)}/>

        </>
    );
}

function PageHeader({onCreate}: {onCreate: () => void}) {
    const {role} = useAuth();
    const isAdmin = role === "ADMIN";
   
    return (
        <div className="flex items-center justify-between mb-4 gap-3">
            <div>
                <h1 className="text-2xl font-bold">Mitarbeiter</h1>
                <p className="text-sm text-slate-500">Verwalte die Mitarbeiter deines Dienstplans.</p>
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