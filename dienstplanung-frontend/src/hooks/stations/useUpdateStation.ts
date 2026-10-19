import { stationApi } from "@/api/stationApi";
import type { Station } from "@/types/station";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateStation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, station}: {id: string, station: Station}) => stationApi.update(id, station),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["station"]});
        },
    });
}