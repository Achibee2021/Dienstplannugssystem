import axios from "axios";

export const apiClient = axios.create({
    baseURL: "/dienstplan",
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, 
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // If the backend says 401 Unauthorized, the token is bad or expired
        if (error.response && error.response.status === 401) {
            
            // 1. Clear the bad token
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");
            
            // 2. Redirect to login (only if we aren't already there)
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);