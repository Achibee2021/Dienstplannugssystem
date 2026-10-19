import { apiClient } from "./client";
import type { ScheduleResponse } from "@/types/schedule";

export const scheduleApi = {
    startSolver: async (): Promise<ScheduleResponse> => {
    const res = await apiClient.post<ScheduleResponse>("/solve");
    return res.data;
    },

    getSolverStatus: async (jobId: string): Promise<ScheduleResponse> => {
        const res = await apiClient.get<ScheduleResponse>(`/solve/${jobId}`);

        return res.data;
    } 

}