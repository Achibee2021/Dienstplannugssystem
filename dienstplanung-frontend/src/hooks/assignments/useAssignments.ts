import { useQuery } from "@tanstack/react-query";
import { assignmentApi } from "@/api/assignmentApi";

export function useAssignments(){
    return useQuery({
        queryKey: ["assignments"],
        queryFn: assignmentApi.getAll,
    });
}