import { apiClient } from "./client";
import type { Employee } from "@/types/employee";

export const employeeApi = {
    getAll: async (): Promise<Employee[]> => {
        const res = await apiClient.get<Employee[]>("/employees");
        return res.data;
    },
    getById: async (id: string): Promise<Employee> => {
        const res = await apiClient.get<Employee>(`/employees/${id}`);
        return res.data;
    },

    create: async (employee: Employee): Promise<Employee> => {
        const res = await apiClient.post<Employee>("/employees", employee);
        return res.data;
    },
    update: async (id: string, employee: Employee): Promise<Employee> => {
        const res = await apiClient.put<Employee>(`/employees/${id}`, employee);
        return res.data;
    },
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/employees/${id}`);
    } 
};