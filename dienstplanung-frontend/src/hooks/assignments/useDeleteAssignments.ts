import { assignmentApi } from "@/api/assignmentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => assignmentApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["assignment"]});
        },
    });
}