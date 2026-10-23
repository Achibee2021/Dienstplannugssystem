import { apiClient } from "./client";

export interface LoginResponse {
    accessToken: string;
    role: string;
    username: string;
}

export const authApi = {
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const res = await apiClient.post<LoginResponse>("/auth/login", {username, password});
        
        return res.data;
    }
}