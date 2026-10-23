import { useAuth } from "@/features/auth/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
    const {token} = useAuth();

    if (!token) {
        return <Navigate to="/login" replace/>;
    }

    return <Outlet />;
}