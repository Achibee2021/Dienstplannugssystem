
export interface AuthContextType {
    token: string | null;
    role: string | null;
    username: string | null;
    login: (token: string, role: string, username: string) => void;
    logout: () => void
}