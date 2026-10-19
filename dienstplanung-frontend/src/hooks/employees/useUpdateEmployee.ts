import { employeeApi } from "@/api/employeeApi";
import type { Employee } from "@/types/employee";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, employee}: {id: string, employee: Employee}) => employeeApi.update(id, employee),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["employees"]});
        },
    });
}