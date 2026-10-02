import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../feature/notifications/hooks/useNotifications';
import { Avatar, AvatarFallback } from '../../@/components/ui/avatar';
import { FiBell, FiHeadphones, FiUser, FiHelpCircle, FiLogOut, FiMessageSquare, FiChevronDown } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../@/components/ui/dropdown-menu";
import { Button } from '../../@/components/ui/button';
import { UserProfileModal } from '@/feature/home/components/UserProfileModal';

const modules = [
  {
    name: 'Administración',
    items: [
      { label: 'Inicio', path: '/dashboard' },
      { label: 'Organizaciones', path: '/dashboard/organizations' },
      { label: 'Agencias', path: '/dashboard/agencies' },
      { label: 'Áreas', path: '/dashboard/areas' },
      { label: 'Usuarios', path: '/dashboard/users' },
      { label: 'Roles', path: '/dashboard/roles' },
    ],
  },
  {
    name: 'Soporte',
    items: [
      { label: 'Tickets', path: '/dashboard/tickets' },
      { label: 'Resoluciones', path: '/dashboard/resolutions' },
      { label: 'Historial', path: '/dashboard/tickethistories' },
      { label: 'Tipos de error', path: '/dashboard/typeerror' },
      { label: 'Sistemas afectados', path: '/dashboard/softwaresystem' },
    ],
  },
  {
    name: 'Inventario',
    items: [
      { label: 'Dispositivos', path: '/dashboard/device' },
      { label: 'Mantenimiento', path: '/dashboard/maintenance' },
      { label: 'Historial de mantenimiento', path: '/dashboard/maintenancehistory' },
      { label: 'Tipos de dispositivo', path: '/dashboard/typedevice' },
      { label: 'Tipos de mantenimiento', path: '/dashboard/typemaintenance' },
      { label: 'Proveedores', path: '/dashboard/supplier' },
    ],
  },
  {
    name: 'Notificaciones',
    items: [
      { label: 'Centro de alertas', path: '/dashboard/notifications' },
      { label: 'Tipos de alerta', path: '/dashboard/alerttypes' },
      { label: 'Configuración', path: '/dashboard/alertconfiguration' },
    ],
  },
  {
    name: "Indicadores",
    items: [
      {label: "Metas generales" , path: "/dashboard/sla"},
      {label: "Metas por agencias", path: "/dashboard/agencieskpi"},
      {label: "Metas por ares", path: "/dashboard/areaskpi"},
      {label: "Rendimiento Técnico", path: "/dashboard/technicialkpi"},
      {label: "Metas de mantenimiento", path: "/dashboard/maintenancekpi"}
    ]
  }
];

export const Navbar: React.FC = () => {
  const { user, getInitials, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const closeModuleTimer = useRef<number | null>(null);

  const userIdActual = user?.id ? Number(user.id) : null;
const { notifications, unreadCount, markAsRead } = useNotifications(userIdActual ?? 0);
  const roles = (user?.roles ?? []).map((role) => role.toLowerCase());
  const canSeeModules = roles.includes('ti') || roles.includes('administrador');

  const openModuleMenu = (moduleName: string) => {
    if (closeModuleTimer.current) {
      window.clearTimeout(closeModuleTimer.current);
      closeModuleTimer.current = null;
    }
    setOpenModule(moduleName);
  };

  const closeModuleMenu = (moduleName: string) => {
    if (closeModuleTimer.current) {
      window.clearTimeout(closeModuleTimer.current);
    }
    closeModuleTimer.current = window.setTimeout(() => {
      setOpenModule((current) => (current === moduleName ? null : current));
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (closeModuleTimer.current) {
        window.clearTimeout(closeModuleTimer.current);
      }
    };
  }, []);

  const primaryRole = user && user.roles.length > 0 ? user.roles[0] : "Usuario";

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  const handleNotificationClick = async (id: number) => {
    await markAsRead(id);
    navigate('/dashboard/notifications');
  };

  return (
    <header className="w-full h-20 bg-white border-b border-neutral-200/80 flex items-center justify-between px-8 lg:px-16 shadow-sm z-10 font-sans select-none">

      {/* Lado Izquierdo: Marca */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="bg-[#1a558b] text-white p-2 rounded-xl shadow-sm flex items-center justify-center">
          <FiHeadphones className="w-6 h-6" />
        </div>
        <span className="text-2xl font-black text-[#1a558b] tracking-wider">HELPDESK</span>
      </div>

      {/* menu navbar  */}
      {canSeeModules && (
        <div className="hidden lg:flex items-center gap-2 relative">
          {modules.map((module) => (
            <div
              key={module.name}
              className="relative"
              onMouseEnter={() => openModuleMenu(module.name)}
              onMouseLeave={() => closeModuleMenu(module.name)}
            >
              <button
                type="button"
                onClick={() => setOpenModule((current) => current === module.name ? null : module.name)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-neutral-600 hover:text-[#1a558b] transition-colors rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <span>{module.name}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${openModule === module.name ? 'rotate-180' : ''}`} />
              </button>

              {openModule === module.name && (
                <div
                  className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-neutral-200 bg-white shadow-lg z-50 p-2"
                  onMouseEnter={() => openModuleMenu(module.name)}
                  onMouseLeave={() => closeModuleMenu(module.name)}
                >
                  {module.items.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => {
                        navigate(item.path);
                        setOpenModule(null);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-700 hover:text-[#1a558b] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lado Derecho: Alertas y Usuario Conectado */}
      <div className="flex items-center gap-6">

        {/* MENÚ DESPLEGABLE DE NOTIFICACIONES */}
        <div className="relative p-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative cursor-pointer text-neutral-600 hover:text-[#1a558b] transition-colors focus:outline-none block group">
              <FiBell className="w-6 h-6 transition-transform group-hover:rotate-12" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 mt-2 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-md font-sans">
              <DropdownMenuLabel className="px-3 py-2 text-sm font-bold text-neutral-800 flex justify-between items-center">
                <span>Notificaciones</span>
                {unreadCount > 0 && (
                  <span className="text-xs font-medium text-[#1a558b] bg-blue-50 px-2 py-0.5 rounded-full">
                    {unreadCount} Nuevas
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-neutral-100" />

              <div className="max-h-64 overflow-y-auto flex flex-col gap-0.5">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-neutral-400">
                    No tienes notificaciones pendientes.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      onClick={() => notif.id && handleNotificationClick(notif.id)}
                      className={`flex gap-3 px-3 py-2.5 rounded-lg cursor-pointer focus:outline-none text-left items-start transition-colors ${!notif.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70 focus:bg-blue-50/70' : 'hover:bg-neutral-50 focus:bg-neutral-50'
                        }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${!notif.isRead ? 'bg-blue-100 text-[#1a558b]' : 'bg-neutral-100 text-neutral-400'
                        }`}>
                        <FiMessageSquare className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs leading-tight ${!notif.isRead ? 'font-bold text-neutral-900' : 'font-medium text-neutral-600'}`}>
                          {notif.alertTypeName || "Alerta de Soporte"}
                        </span>
                        <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                          {notif.textMessage || "Sin descripción disponible."}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-medium mt-1">
                          {notif.sentAt ? new Date(notif.sentAt).toLocaleDateString() : "Reciente"}

                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>

              <DropdownMenuSeparator className="my-1 bg-neutral-100" />

              <div className="p-1">
                <Button
                  onClick={() => navigate(`/dashboard/notifications`)}
                  variant="ghost"
                  className="w-full text-center text-xs font-bold text-[#1a558b] hover:text-[#154673] hover:bg-blue-50/50 py-1.5 h-8 rounded-lg"
                >
                  Ver todas las notificaciones
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* MENÚ DESPLEGABLE DEL USUARIO */}
        <div className="border-l pl-6 border-neutral-200">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer focus:outline-none hover:opacity-85 transition-opacity group">
              <Avatar className="w-10 h-10 bg-[#1a558b] text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
                <AvatarFallback className="bg-[#1a558b] text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left sm:flex">
                <span className="text-sm font-bold text-neutral-800 leading-none">
                  {primaryRole}
                </span>
                <span className="text-xs text-neutral-400 mt-0.5">
                  {user?.username || 'Cargando...'}
                </span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-md font-sans">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-neutral-400">
                Mi Cuenta
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-neutral-100" />

              <DropdownMenuItem
                onClick={() => {
                  // Evalua si es cliente 
                  const isCliente = user?.roles.some(r => r.toLowerCase() === 'cliente');

                  if (isCliente) {
                    setIsProfileOpen(true); 
                  } else {
                    navigate(`/dashboard/users/details/${user?.id}`); 
                  }
                }}
                className="flex items-center gap-2.5 px-2 py-2 text-sm text-neutral-700 rounded-lg hover:bg-neutral-50 cursor-pointer focus:bg-neutral-50 focus:outline-none"
              >
                <FiUser className="w-4 h-4 text-neutral-400" />
                <span>Ver Perfil</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate('/dashboard/faq')}
                className="flex items-center gap-2.5 px-2 py-2 text-sm text-neutral-700 rounded-lg hover:bg-neutral-50 cursor-pointer focus:bg-neutral-50 focus:outline-none"
              >
                <FiHelpCircle className="w-4 h-4 text-neutral-400" />
                <span>Preguntas / FAQ</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-neutral-100" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-2 py-2 text-sm text-red-600 font-medium rounded-lg hover:bg-red-50 cursor-pointer focus:bg-red-50 focus:outline-none"
              >
                <FiLogOut className="w-4 h-4 text-red-500" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
      <UserProfileModal 
  isOpen={isProfileOpen} 
  onClose={() => setIsProfileOpen(false)} 
/>
    </header>
  );
};