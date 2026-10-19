import type { Station } from "@/types/station";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
    station: Station;
    onEdit: (station: Station) => void;
    onDelete: (station: Station) => void;
};


export function StationRow ({station, onEdit, onDelete}: Props) {
    //const freeDays = station.wunschFreiTage ?? [];

    return (
        <tr className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3 font-medium text-slate-800">
                {station.name}
            </td>
            <td className="px-4 py-3 text-slate-600">
                {station.benoetigtQualification}
            </td>
            <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                {station.benoetigteAnzahlMitarbeiter}
            </td>
            <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(station)}
                        aria-label={`${station.name} bearbeiten`}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100
                        hover:text-slate-800"
                    >
                        <Pencil className="h-4 w-4"/>
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(station)}
                        aria-label={`${station.name} löschen`}
                        className="rounded p-1.5 text-slate-500 hover:bg-red-50
                        hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4"/>
                    </button>
                </div>
            </td>
        </tr>
    );
}