import axios from "axios";

export const apiClient = axios.create({
    baseURL: "/dienstplan",
    headers: {
        "Content-Type": "application/json",
    },
});