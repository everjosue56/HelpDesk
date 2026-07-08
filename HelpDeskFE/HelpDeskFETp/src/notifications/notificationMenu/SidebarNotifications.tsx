import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBell, FiAlertCircle } from 'react-icons/fi';
import { SlidersHorizontal } from 'lucide-react'; 
import { useAuth } from '@/context/AuthContext';

interface MenuItem {
  name: string;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<{ className?: string }> | any; 
  allowedRoles: string[]; 
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const SidebarNotifications: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); 

  const userRoles = user?.roles.map(r => r.toLowerCase()) ?? [];

  const menuGroups: MenuGroup[] = [
    {
      title: "PRINCIPAL",
      items: [
        {
          name: "Inicio",
          path: "/dashboard",
          icon: FiHome,
          allowedRoles: ["administrador", "ti", "cliente"]
        },
      ]
    },
    {
      title: "NOTIFICACIONES", 
      items: [
        {
          name: "Notificaciones",
          path: "/dashboard/notifications",
          icon: FiBell,
          allowedRoles: ["administrador", "ti", "cliente"] 
        },
        {
          name: "Configuracion Alertas",
          path: "/dashboard/alertconfiguration",
          icon: SlidersHorizontal, 
          allowedRoles: ["administrador", "ti"] 
        },
        {
          name: "Tipo Alerta",
          path: "/dashboard/alerttypes",
          icon: FiAlertCircle,
          allowedRoles: ["administrador", "ti"] 
        }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-full flex flex-col select-none shrink-0 pt-4 font-sans">

      {/* Listado de Opciones*/}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 clean-scrollbar">
        {menuGroups.map((group, gIdx) => {
          const visibleItems = group.items.filter(item => 
            item.allowedRoles.some(role => userRoles.includes(role))
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1.5">
  
              <span className="text-[11px] font-bold text-neutral-400 tracking-wide px-3 block">
                {group.title}
              </span>
              <div className="space-y-0.5">
              
                {visibleItems.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`));

                  return (
                    <button
                      key={iIdx}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer text-left focus:outline-none ${
                        isActive
                          ? 'bg-slate-100 text-[#1a558b]'
                          : 'text-neutral-500 hover:bg-slate-50 hover:text-neutral-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1a558b]' : 'text-neutral-400'}`} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      
      {/* Pie de página*/}
      <div className="p-5 border-t border-neutral-100 bg-slate-50/50 mt-auto text-center flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-neutral-500 tracking-wide">
          System © {new Date().getFullYear()}
        </span>
        <span className="text-[9px] font-medium text-neutral-400">
          HelpDesk v1.0.0 • Todos los derechos reservados
        </span>
      </div>

    </aside>
  );
};