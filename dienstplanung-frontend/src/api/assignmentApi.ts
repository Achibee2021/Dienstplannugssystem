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
        },
        updateAssignmentEmployee: async (id: string, employeeId: string | null): Promise<Assignment> => {
            const res = await apiClient.patch<Assignment>(`/assignment/${id}/employee`, {employeeId: employeeId});
            return res.data;
        },
        duplicateAssignment: async (id: string, employeeId: string ): Promise<Assignment> => {
            const res = await apiClient.post<Assignment>(`/assignment/${id}/duplicate`, {employeeId: employeeId});
            return res.data;
        },
        validateMove: async (assignmentId: string, targetEmployeeId: string): Promise<{isValid: boolean, errorMessage?: string}> => {
            const res = await apiClient.post(`/assignment/validate-move`, {assignmentId, targetEmployeeId});
            return res.data;
        },
        transfer: async (id: string, targetEmployeeId: string): Promise<Assignment> => {
            const res = await apiClient.post(`/assignment/${id}/transfer`, {targetEmployeeId:targetEmployeeId});
            return res.data;
        },
        moveToDay: async (assignmentId: string, day: string, employeeId: string): Promise<Assignment> => {
            const res = await apiClient.post<Assignment>(`/assignment/${assignmentId}/move-to-day`, {day, employeeId})
            return res.data;
        },
        duplicateToDay: async (assignmentId: string, day: string, employeeId: string): Promise<Assignment> => {
            const res = await apiClient.post<Assignment>(`/assignment/${assignmentId}duplicate-to-day`, {day, employeeId})
            return res.data;
        },
}