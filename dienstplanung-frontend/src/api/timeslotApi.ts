import { apiClient } from "./client";
import type { Timeslot } from "@/types/timeslots";

export const timeslotApi = {
    getAll: async (): Promise<Timeslot[]> => {
        const res = await apiClient.get<Timeslot[]>("/timeslot");
        return res.data;
    },
    getById: async (id: string): Promise<Timeslot> => {
        const res = await apiClient.get<Timeslot>(`/timeslot${id}`);
        return res.data;
    },

    create: async (timeslot: Timeslot): Promise<Timeslot> => {
            const res = await apiClient.post<Timeslot>("/timeslot", timeslot);
            return res.data;
        },
        update: async (id: string, timeslot: Timeslot): Promise<Timeslot> => {
            const res = await apiClient.put<Timeslot>(`/timeslot/${id}`, timeslot);
            return res.data;
        },
        delete: async (id: string): Promise<void> => {
            await apiClient.delete(`/timeslot/${id}`);
        } 
}