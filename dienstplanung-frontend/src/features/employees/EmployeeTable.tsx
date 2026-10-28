import type { Employee } from "@/types/employee";
import { EmployeeRow } from "./EmployeeRow";

type Props = Readonly<{
    employees: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
}>;

export function EmployeeTable({employees, onEdit, onDelete}: Props) {

        return (
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Qualifikation</th>
                            <th className="px-4 py-3 font-medium text-right">Std/Wo</th>
                            <th className="px-4 py-3 font-medium">Wunschschicht</th>
                            <th className="px-4 py-3 font-medium">Freie Tage</th>
                            <th className="px-4 py-3 font-medium text-right">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((e) => (
                            <EmployeeRow key={e.id} employee={e} onEdit={onEdit} onDelete={onDelete}/>
                        ))}
                    </tbody>
                </table>
            </div>
        );
}