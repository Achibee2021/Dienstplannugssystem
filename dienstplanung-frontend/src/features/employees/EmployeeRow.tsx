import type { Employee } from "@/types/employee"
import { DAY_LABEL_SHORT, SHIFT_LABEL } from "../weekly-plan/labels";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

type Props = {
    employee: Employee;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
};


export function EmployeeRow ({employee, onEdit, onDelete}: Props) {
    const freeDays = employee.wunschFreiTage ?? [];
    const {role} = useAuth();
    const isAdmin = role === "ADMIN";

    return (
        <tr className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3 font-medium text-slate-800">
                {employee.name}
            </td>
            <td className="px-4 py-3 text-slate-600">
                {employee.qualification}
            </td>
            <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                {employee.wochenStunden}
            </td>
            <td className="px-4 py-3 text-slate-600">
                {SHIFT_LABEL[employee.wunschSchicht] ?? employee.wunschSchicht}
            </td>
            <td className="px-4 py-3 text-slate-600">
                {freeDays.length === 0
                    ? <span>-</span>
                    : freeDays.map((d) => DAY_LABEL_SHORT[d]).join(", ")
                }
            </td>
            <td className="px-4 py-3 text-right">
                {isAdmin ? (<div className="inline-flex gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(employee)}
                        aria-label={`${employee.name} bearbeiten`}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100
                        hover:text-slate-800"
                    >
                        <Pencil className="h-4 w-4"/>
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(employee)}
                        aria-label={`${employee.name} löschen`}
                        className="rounded p-1.5 text-slate-500 hover:bg-red-50
                        hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4"/>
                    </button>
                </div>): <div className="text-slate-400">-</div>}
            </td>
        </tr>
    );
}