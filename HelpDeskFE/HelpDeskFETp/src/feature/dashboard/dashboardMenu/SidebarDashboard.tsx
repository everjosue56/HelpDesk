import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Home, 
    Flag, 
    Building2, 
    MapPin, 
    UserCheck,
    Wrench,
} from 'lucide-react';

export const SidebarDashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuGroups = [
        {
            title: "PRINCIPAL",
            items: [
                {
                    name: "Inicio",
                    path: "/dashboard",
                    icon: Home
                },
            ]
        },
        {
            title: "DASHBOARD/GENERAL",
            items: [
                {
                    name: "Metas",
                    path: "/dashboard/sla", 
                    icon: Flag
                },
                {
                    name: "Agencias",
                    path: "/dashboard/agencieskpi",
                    icon: Building2
                },
                {
                    name: "Areas",
                    path: "/dashboard/areaskpi",
                    icon: MapPin
                },
                {
                    name: "Rendimiento Tecnicos",
                    path: "/dashboard/technicialkpi",
                    icon: UserCheck
                },
                {
                    name: "Mantenimientos",
                    path: "/dashboard/maintenancekpi",
                    icon: Wrench
                },
            ]
        }
    ];

    return (
        <aside className="w-64 bg-white border-r border-neutral-200 h-full flex flex-col select-none shrink-0 pt-4 font-sans">

            {/* Listado de Opciones del Sidebar */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6 clean-scrollbar text-left">
                {menuGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                        <span className="text-[11px] font-black text-neutral-400 tracking-wider px-3 block">
                            {group.title}
                        </span>
                        <div className="space-y-0.5">
                            {group.items.map((item, iIdx) => {
                                const Icon = item.icon;
                                const isActive =
                                    location.pathname === item.path ||
                                    (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`));

                                return (
                                    <button
                                        key={iIdx}
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer text-left focus:outline-none border-none ${
                                            isActive
                                                ? 'bg-[#eef2f5] text-slate-700' 
                                                : 'text-neutral-500 bg-transparent hover:bg-slate-50 hover:text-neutral-800'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-700' : 'text-neutral-400'}`} />
                                        <span>{item.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* footer  */}
            <div className="mt-auto flex flex-col">
                <div className="p-5 border-t border-neutral-100 bg-slate-50/50 text-center flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-neutral-500 tracking-wide">
                        HelpDesk | EG © {new Date().getFullYear()}
                    </span>
                    <span className="text-[9px] font-medium text-neutral-400">
                        HelpDesk v1.0.0 • Todos los derechos reservados
                    </span>
                </div>
            </div>

        </aside>
    );
};