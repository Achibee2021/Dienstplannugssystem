import { timeslotApi } from "@/api/timeslotApi";
import type { Timeslot } from "@/types/timeslots";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTimeslot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, timeslot}: {id: string, timeslot: Timeslot}) => timeslotApi.update(id, timeslot),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["timeslot"]});
        },
    });
}