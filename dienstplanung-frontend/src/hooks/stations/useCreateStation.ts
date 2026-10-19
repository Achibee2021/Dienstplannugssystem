import { stationApi } from "@/api/stationApi";
import type { Station } from "@/types/station";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateStation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (station: Station) => stationApi.create(station),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["station"]});
        },
    });
}