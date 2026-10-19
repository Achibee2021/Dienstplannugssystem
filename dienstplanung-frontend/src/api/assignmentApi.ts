import { apiClient } from "./client";
import type { Assignment } from "@/types/assignment";

export const assignmentApi = {
    getAll: async (): Promise<Assignment[]> => {
        const res = await apiClient.get<Assignment[]>("/assignment");
        return res.data;
    },

    getById: async (id: string): Promise<Assignment> => {
        const res = await apiClient.get<Assignment>(`/assignment/${id}`);
        return res.data; 
    },

    create: async (assignment: Assignment): Promise<Assignment> => {
            const res = await apiClient.post<Assignment>("/assignment", assignment);
            return res.data;
        },
        update: async (id: string, assignment: Assignment): Promise<Assignment> => {
            const res = await apiClient.put<Assignment>(`/assignment/${id}`, assignment);
            return res.data;
        },
        delete: async (id: string): Promise<void> => {
            await apiClient.delete(`/assignment/${id}`);
        } 
}