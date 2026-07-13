import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../@/components/ui/card';
import { Button } from '../../../../@/components/ui/button';
import { FiGrid, FiSettings, FiPackage, FiSliders, FiBell, FiChevronRight, FiMonitor, FiActivity, FiCheckCircle, FiFolder } from 'react-icons/fi';
import { Navbar } from './../../../shared/Navbar';
import { useHomeKPIs } from '../hooks/useHomeKPIs';
import { useAuth } from '@/context/AuthContext';

const modulesData = [
  {
    title: "General / Dashboard",
    description: "Vista general del sistema con métricas y estadísticas claves",
    path: "/dashboard/sla",
    icon: FiGrid,
    allowedRoles: ["Administrador", "TI"] 
  },
  {
    title: "Soporte",
    description: "Gestión de tickets, incidencias y atención al cliente",
    path: "/dashboard/tickets",
    icon: FiSettings,
    allowedRoles: ["Administrador", "TI", "Cliente"] 
  },
  {
    title: "Inventario",
    description: "Control de equipos, mantenimiento y recursos de la organización",
    path: "/dashboard/device",
    icon: FiPackage,
    allowedRoles: ["Administrador", "TI"]  
  },
  {
    title: "Administrativo",
    description: "Configuración del sistema, usuarios y organizaciones",
    path: "/dashboard/organizations",
    icon: FiSliders,
    allowedRoles: ["Administrador", "TI"]  
  },
  {
    title: "Notificaciones",
    description: "Gestión de notificaciones y configuración de alertas",
    path: "/dashboard/notifications",
    icon: FiBell,
    allowedRoles: ["Administrador", "TI", "Cliente"]
  }
];

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { kpis } = useHomeKPIs();

  const isCliente = user?.roles.some(r => r.toLowerCase() === 'cliente') ?? false;

  const visibleModules = modulesData.filter(mod => 
    user?.roles.some(userRol => 
      mod.allowedRoles.map(r => r.toLowerCase()).includes(userRol.toLowerCase())
    )
  );

  return (
    <div className="w-full min-h-screen bg-neutral-100/60 flex flex-col antialiased">
      <Navbar />

      {/* CONTENIDO PRINCIPAL DEL HUB */}
      <main className="flex-1 max-w-300 w-full mx-auto px-6 py-10 lg:py-14 flex flex-col gap-10">

        {/* Encabezado de Bienvenida */}
        <div className="text-left flex flex-col gap-1 select-none">
          <h1 className="text-4xl lg:text-[34px] font-extrabold text-neutral-800 tracking-tight">
            Bienvenido al Sistema
          </h1>
          <p className="text-lg text-neutral-500">
            Seleccione un módulo para comenzar a trabajar
          </p>
        </div>

        {/* ─── SECCIÓN DE MÉTRICAS DINÁMICAS ─── */}
        <div className={`grid grid-cols-1 ${isCliente ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 select-none`}>
          
          {/* Tarjeta 1:  (Total Creados para Cliente / Resueltos Hoy para Admin/TI) */}
          <Card className="bg-white border-neutral-200/60 shadow-sm rounded-2xl p-6">
            <div className="flex flex-row items-center gap-4 w-full">
              {/* Cambiamos el color de fondo del ícono si es cliente para darle un toque fresco */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${isCliente ? 'bg-gray-50 text-gray-600 border-emerald-100/40' : 'bg-gray-50 text-gray-700 border-blue-100/40'}`}>
                {isCliente ? <FiFolder className="w-7 h-7" /> : <FiCheckCircle className="w-7 h-7" />}
              </div>
              <div className="flex flex-col text-left">

                <p className="text-sm font-bold text-neutral-500 leading-tight">
                  {isCliente ? "Total tickets creados" : "Tickets resueltos hoy"}
                </p>
                
                <p className="text-3xl font-black text-neutral-800 mt-1">
                  {kpis?.resolvedToday ?? 0}
                </p>
              </div>
            </div>
          </Card>

          {/* Tarjeta 2: (Tickets en proceso para Cliente / Total Activos para Admin/TI) */}
          <Card className="bg-white border-neutral-200/60 shadow-sm rounded-2xl p-6">
            <div className="flex flex-row items-center gap-4 w-full">
              <div className="w-14 h-14 bg-blue-50 text-[#1a558b] rounded-2xl flex items-center justify-center shrink-0 border border-blue-100/40">
                <FiActivity className="w-7 h-7" />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-sm font-bold text-neutral-500 leading-tight">
                  {isCliente ? "Mis tickets en proceso" : "Total Tickets Activos"}
                </p>
                <p className="text-3xl font-black text-neutral-800 mt-1">
                  {kpis?.activeTickets ?? 0}
                </p>
              </div>
            </div>
          </Card>

          {/* Tarjeta 3: Total Dispositivos (REGLA: Solo visible para Administrador o TI) */}
          {!isCliente && (
            <Card className="bg-white border-neutral-200/60 shadow-sm rounded-2xl p-6">
              <div className="flex flex-row items-center gap-4 w-full">
                <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200/60">
                  <FiMonitor className="w-7 h-7" />
                </div>
                <div className="flex flex-col text-left">
                  <p className="text-sm font-bold text-neutral-500 leading-tight">Total Dispositivos</p>
                  <p className="text-3xl font-black text-neutral-800 mt-1">
                    {kpis?.totalDevices ?? 0}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* ─── SECCIÓN DE ACCESOS DIRECTOS A MÓDULOS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
          {visibleModules.map((mod, index) => {
            const IconComponent = mod.icon;
            
            const isLastOdd = index === visibleModules.length - 1 && visibleModules.length % 2 !== 0;

            return (
              <Card 
                key={mod.path} 
                className={`bg-white border-neutral-200/60 shadow-md hover:shadow-lg transition-all rounded-[22px] overflow-hidden flex flex-col justify-between h-52.5 relative p-2 ${
                  isLastOdd ? 'md:col-span-2 md:max-w-140 md:mx-auto w-full' : ''
                }`}
              >
                <CardHeader className="flex flex-row gap-4 items-start pt-6 px-6">
                  <div 
                    className="bg-[#154673] text-white p-3.5 rounded-[16px] shadow-sm cursor-pointer"
                    onClick={() => navigate(mod.path)}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <CardTitle 
                      className="text-xl font-bold text-neutral-800 text-left cursor-pointer hover:text-[#154673] transition-colors" 
                      onClick={() => navigate(mod.path)}
                    >
                      {mod.title}
                    </CardTitle>
                    <CardDescription className="text-base text-neutral-400 text-left leading-snug">
                      {mod.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="flex justify-end items-center border-t border-neutral-50 py-3 px-6 mt-auto">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(mod.path)}
                    className="text-[#1a558b] hover:text-[#154673] hover:bg-blue-50/50 font-bold text-sm flex items-center gap-1.5 p-0 cursor-pointer"
                  >
                    Acceder <FiChevronRight className="w-4 h-4 stroke-3" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </main>
    </div>
  );
};

export default HomePage;