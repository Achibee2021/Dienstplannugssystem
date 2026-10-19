import type { Station } from "@/types/station";
import { StationRow } from "./StationRow";

type Props = {
    stations: Station[];
    onEdit: (station: Station) => void;
    onDelete: (station: Station) => void;
}

export function StationTable({stations, onEdit, onDelete}: Props) {

        return (
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Qualifikation</th>
                            <th className="px-4 py-3 font-medium text-right">Anzahl Mit.</th>
                            <th className="px-4 py-3 font-medium text-right">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stations.map((s) => (
                            <StationRow key={s.id} station={s} onEdit={onEdit} onDelete={onDelete}/>
                        ))}
                    </tbody>
                </table>
            </div>
        );
}