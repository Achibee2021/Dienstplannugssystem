import { stationApi } from "@/api/stationApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteStation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => stationApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["station"]});
        },
    });
}