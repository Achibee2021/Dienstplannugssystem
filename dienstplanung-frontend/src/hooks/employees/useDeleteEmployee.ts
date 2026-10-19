import { employeeApi } from "@/api/employeeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => employeeApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["employees"]});
        },
    });
}