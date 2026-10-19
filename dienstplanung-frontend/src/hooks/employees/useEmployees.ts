import {useQuery} from "@tanstack/react-query";
import { employeeApi } from "@/api/employeeApi";

export function useEmployees(){
    return useQuery({
        queryKey: ["employees"],
        queryFn: employeeApi.getAll,
    });
}