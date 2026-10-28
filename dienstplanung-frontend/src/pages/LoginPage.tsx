import { authApi } from "@/api/authApi";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";
import { Loader2 } from "lucide-react";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await authApi.login(username, password);
            login(data.accessToken, data.role, data.username);
            await navigate("/dashboard");
        } catch {
            setError("Üngultiger Benutzername oder Password.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Dienstplan</h1>
                    <p className="text-sm text-slate-500">Melde dich an, um fortzufahren.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Benutzername</label>
                        <Input 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <Input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="*****"
                            required
                        />
                    </div>

                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm
                        font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin"/>}
                        {loading ? "Anmelden...." : "Anmelden"}
                    </button>
                </form>
            </div>
        </div>
    )
}