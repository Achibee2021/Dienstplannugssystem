import { apiClient } from "./client";
import type { Station } from "@/types/station";

export const stationApi = {
    getAll: async (): Promise<Station[]> => {
        const res = await apiClient.get<Station[]>("/station");
        return res.data;
    },

    getById: async (id: string): Promise<Station> => {
        const res = await apiClient.get<Station>(`/station/${id}`);
        return res.data;
    },

    create: async (station: Station): Promise<Station> => {
            const res = await apiClient.post<Station>("/station", station);
            return res.data;
        },
        update: async (id: string, station: Station): Promise<Station> => {
            const res = await apiClient.put<Station>(`/station/${id}`, station);
            return res.data;
        },
        delete: async (id: string): Promise<void> => {
            await apiClient.delete(`/station/${id}`);
        } 
}