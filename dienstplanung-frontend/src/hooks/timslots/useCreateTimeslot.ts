import { timeslotApi } from "@/api/timeslotApi";
import type { Timeslot } from "@/types/timeslots";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateTimeslot() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (timeslot: Timeslot) => timeslotApi.create(timeslot),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["timeslot"]});
        },
    });
}