import type { ScheduleResponse } from "@/types/schedule";
import { apiClient } from "./client"

export const solveApi = {
    start: async (): Promise<string> => {
        const res = await apiClient.post<string>("/solve");
        return res.data;
    },

    getStatus: async (jobId: string): Promise<ScheduleResponse> => {
        const res = await apiClient.get<ScheduleResponse>(`/solve/${jobId}`);
        return res.data;
    },

    stop: async (jobId: string): Promise<void> => {
        await apiClient.post(`/solve/${jobId}/stop`);
    },
}