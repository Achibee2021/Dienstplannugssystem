import { employeeApi } from "@/api/employeeApi";
import type { Employee } from "@/types/employee";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (employee: Employee) => employeeApi.create(employee),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["employees"]});
        },
    });
}