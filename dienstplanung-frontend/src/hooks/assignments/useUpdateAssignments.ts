import { assignmentApi } from "@/api/assignmentApi";
import type { Assignment } from "@/types/assignment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, assignment}: {id: string, assignment: Assignment}) => assignmentApi.update(id, assignment),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["assignments"]});
        },
    });
}