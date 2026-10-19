import { solveApi } from "@/api/solveApi";
import { useQuery } from "@tanstack/react-query";

export function useSolveJob(jobId:string | null) {
    return useQuery({
        queryKey: ["solve", jobId],
        queryFn: () => jobId ? solveApi.getStatus(jobId) : null,
        enabled: jobId != null,
        refetchInterval: (query) => {
            const data = query.state.data;
            return data?.isSolving ? 2000 : false;
        },
    });
}