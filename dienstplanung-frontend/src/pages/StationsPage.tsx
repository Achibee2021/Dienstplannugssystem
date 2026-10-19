import { Input } from "@/components/ui/input";
import { DeleteStationDialog } from "@/features/stations/DeleteStationDialog";
import { StationFormDialog } from "@/features/stations/StationFormDialog";
import { StationTable } from "@/features/stations/StationTable";
import { useStations } from "@/hooks/stations/useStations";
import type { Station } from "@/types/station";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";

export default function StationPage(){
    const {data, isLoading, error} = useStations();
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingStation, setEditingStation] = useState<Station | null>(null);
    const [deletingStation, setDeletingStation] = useState<Station | null>(null);


    const filtered = useMemo(() => {
        const list = data ?? [];
        if (!search.trim()) {
            return list;
        }
        const searchWord = search.toLowerCase();
        return list.filter((s) => 
                s.name.toLowerCase().includes(searchWord) || 
                s.benoetigtQualification.toLowerCase().includes(searchWord));
    }, [data, search]);

    const handleCreate = () => {
        setEditingStation(null);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingStation(null);
    };

    const handleEdit = (station: Station) => {
        setEditingStation(station);
        setFormOpen(true);
    };

    const handleDelete = (station: Station) => {
        setDeletingStation(station);
        
    }

    if(isLoading) {
        return (
            <>
                <PageHeader onCreate={handleCreate}/>
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Lade Station...
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
                    onChange={(s) => setSearch(s.target.value)}
                    className="max-w-xs"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-12 text-center
                 flex flex-col items-center justify-center">
                    <MapPin className="h-10 w-10 text-slate-300 mb-4"/>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">
                        {search
                        ? "Keine Station gefunden"
                        : "Noch keine Station. Lege den ersten an."}
                    </h3>
                    <p>
                        {search
                            ? "Versuche es mit einem anderen Suchbegriff."
                            : "Füge deinen ersten Station hinzu, um mit der Planung zu beginnen."}
                    </p>
                    {!search && (
                        <button onClick={handleCreate} className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                            + Neu
                        </button>
                    )}
                </div>
            ) : (
                <StationTable stations={filtered} onEdit={handleEdit} onDelete={handleDelete}/>
            )}
            <StationFormDialog key={editingStation?.id ?? "new"} open={formOpen} station={editingStation} onClose={handleCloseForm} onSaved={handleCloseForm} />
            <DeleteStationDialog station={deletingStation} onClose={() => setDeletingStation(null)}/>

        </>
    );
}

function PageHeader({onCreate}: {onCreate: () => void}) {
   
    return (
        <div className="flex items-center justify-between mb-4 gap-3">
            <div>
                <h1 className="text-2xl font-bold">Station</h1>
                <p className="text-sm text-slate-500">Verwalte die Station deines Dienstplans.</p>
            </div>
            <button
                type="button"
                onClick={onCreate}
                className="inline-flex items-center gap-2 rounded-md bg-slate-900
                px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
                + Neu
            </button>
        </div>
    );
}