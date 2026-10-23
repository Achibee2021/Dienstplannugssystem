import { useAuth } from "@/features/auth/AuthContext";
import { Calendar, Clock, LayoutDashboard, LinkIcon, MapPin, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
    //{to: "/dashboard", label: "Dashboard", icon: LayoutDashboard},
    //{to: "/plan", label: "Planung", icon: Calendar},
    {to: "/employees", label: "Mitarbeiter", icon: Users},
    {to: "/stations", label: "Stationen", icon: MapPin},
    {to: "/timeslots", label: "Zeitslots", icon: Clock},
    {to: "/assignments", label: "Zuweisungen", icon: LinkIcon},
];

export function Sidebar() {

    const {role} = useAuth();
    

    const canSeeMasterData = role === "ADMIN" || role === "PLANNER";

    return (
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            <NavLink to="/dashboard"
                className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm  font-medium transition-colors
                            ${isActive} ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white"`}
            >
                <LayoutDashboard className="h-5 w-5"/>
                Dashboard
            </NavLink>
            <NavLink to="/plan"
                className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm  font-medium transition-colors
                            ${isActive} ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white"`}
            >
                <Calendar className="h-5 w-5"/>
                Planung
            </NavLink>

            {canSeeMasterData && (
                <>
                    {NAV_LINKS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm  font-medium transition-colors
                            ${isActive} ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white"`}
                        >
                            <item.icon className="h-5 w-5"/>
                            {item.label}
                        </NavLink>
                    ))}
                </>
            )}
            
        </nav>
    );
}