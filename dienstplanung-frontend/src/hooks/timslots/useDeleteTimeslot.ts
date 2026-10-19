import { timeslotApi } from "@/api/timeslotApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteTimeslot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => timeslotApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["timeslot"]});
        },
    });
}