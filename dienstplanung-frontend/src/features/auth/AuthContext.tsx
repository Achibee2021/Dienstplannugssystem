/* eslint-disable react-refresh/only-export-components */
import type { AuthContextType } from "@/types/authContextType";
import { createContext, useContext, useState, type ReactNode } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {

    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

    const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"));

    const [username, setUsername] = useState<string | null>(() => localStorage.getItem("username"));

    const login = (newToken: string, newRole: string, newUsername: string) => {
        setToken(newToken);
        setRole(newRole);
        setUsername(newUsername);

        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);
        localStorage.setItem("username", newUsername);
        
    }

    const logout = () => {
        setToken(null);
        setRole(null);
        setUsername(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
    }

    return (
        <AuthContext.Provider value={{token, role, username, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}