import { useQuery } from "@tanstack/react-query";
import { assignmentApi } from "@/api/assignmentApi";

export function useAssignments(){
    return useQuery({
        queryKey: ["assignment"],
        queryFn: assignmentApi.getAll,
    });
}