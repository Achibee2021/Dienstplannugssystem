import { assignmentApi } from "@/api/assignmentApi";
import type { Assignment } from "@/types/assignment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (assignment: Assignment) => assignmentApi.create(assignment),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["assignment"]});
        },
    });
}