import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Button } from '../../../@/components/ui/button';
import { FiGrid, FiSettings, FiPackage, FiSliders, FiBell, FiChevronRight, FiMonitor, FiActivity, FiCheckCircle } from 'react-icons/fi';
import { Navbar } from '@/components/Navbar';
import { useHomeKPIs } from '../hooks/useHomeKPIs';


const modulesData = [
  {
    title: "General / Dashboard",
    description: "Vista general del sistema con métricas y estadísticas claves",
    path: "/dashboard/sla",
    icon: FiGrid,
  },
  {
    title: "Soporte",
    description: "Gestión de tickets, incidencias y atención al cliente",
    path: "/dashboard/tickets",
    icon: FiSettings,
  },
  {
    title: "Inventario",
    description: "Control de equipos, mantenimiento y recursos de la organización",
    path: "/dashboard/device",
    icon: FiPackage,
  },
  {
    title: "Administrativo",
    description: "Configuración del sistema, usuarios y organizaciones",
    path: "/dashboard/organizations",
    icon: FiSliders,
  },
  {
    title: "Notificaciones",
    description: "Gestión de notificaciones y configuración de alertas",
    path: "/dashboard/notifications",
    icon: FiBell,
  }
];

export const HomePage: React.FC = () => {

  const { kpis } = useHomeKPIs();
  const navigate = useNavigate();   
  

  return (
    <div className="w-full min-h-screen bg-neutral-100/60 flex flex-col antialiased">

     <Navbar />

      {/* 2. CONTENIDO PRINCIPAL DEL HUB */}
      <main className="flex-1 max-w-300 w-full mx-auto px-6 py-10 lg:py-14 flex flex-col gap-10">

        {/* Encabezado de Bienvenida */}
        <div className="text-left flex flex-col gap-1">
          <h1 className="text-4xl lg:text-[34px] font-extrabold text-neutral-800 tracking-tight">
            Bienvenido al Sistema
          </h1>
          <p className="text-lg text-neutral-500">
            Seleccione un módulo para comenzar a trabajar
          </p>
        </div>

        {/* SECCIÓN DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">

          {/* Tarjeta 1: Tickets Resueltos Hoy */}
          <Card className="bg-white border-neutral-200/60 shadow-sm rounded-2xl p-6">
            <div className="flex flex-row items-center gap-4 w-full">
              <div className="w-14 h-14 bg-gray-50 text-gray-700 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100/40">
                <FiCheckCircle className="w-7 h-7" />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-sm font-bold text-neutral-500 leading-tight">Tickets resueltos hoy</p>
                <p className="text-3xl font-black text-neutral-800 mt-1">{kpis.resolvedToday} </p>
              </div>
            </div>
          </Card>

          {/* Tarjeta 2: Tickets Activos */}
          <Card className="bg-white border-neutral-200/60 shadow-sm rounded-2xl p-6">
            <div className="flex flex-row items-center gap-4 w-full">
              <div className="w-14 h-14 bg-blue-50 text-[#1a558b] rounded-2xl flex items-center justify-center shrink-0 border border-blue-100/40">
                <FiActivity className="w-7 h-7" />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-sm font-bold text-neutral-500 leading-tight">Total Tickets Activos </p>
                <p className="text-3xl font-black text-neutral-800 mt-1">{kpis.activeTickets}</p>
              </div>
            </div>
          </Card>

          {/* Tarjeta 3: Dispositivos */}
          <Card className="bg-white border-neutral-200/60 shadow-sm rounded-2xl p-6">
            <div className="flex flex-row items-center gap-4 w-full">
              <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200/60">
                <FiMonitor className="w-7 h-7" />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-sm font-bold text-neutral-500 leading-tight">Total Dispositivos</p>
                <p className="text-3xl font-black text-neutral-800 mt-1">{kpis.totalDevices} </p>
              </div>
            </div>
          </Card>

        </div>

        {/* SECCIÓN DE MÓDULOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
          {modulesData.slice(0, 4).map((mod, index) => {
            const IconComponent = mod.icon;
            return (
              <Card key={index} className="bg-white border-neutral-200/60 shadow-md hover:shadow-lg transition-all rounded-[22px] overflow-hidden flex flex-col justify-between h-52.5 relative p-2">
                <span className="absolute top-4 right-4 bg-neutral-100 text-[10px] text-neutral-400 font-medium px-2.5 py-0.5 rounded-full">
                </span>
                <CardHeader className="flex flex-row gap-4 items-start pt-6 px-6">
                  <div className="bg-[#154673] text-white p-3.5 rounded-[16px] shadow-sm">
                    <IconComponent className="w-6 h-6"    onClick={() => navigate(mod.path)} />
                  </div>
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <CardTitle className="text-xl font-bold text-neutral-800 text-left" onClick={() => navigate(mod.path)}>{mod.title}</CardTitle>
                    <CardDescription className="text-base text-neutral-400 text-left leading-snug">{mod.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-end items-center border-t border-neutral-50 py-3 px-6 mt-auto">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(mod.path)}
                    className="text-[#1a558b] hover:text-[#154673] hover:bg-blue-50/50 font-bold text-sm flex items-center gap-1.5 p-0"
                  >
                    Acceder <FiChevronRight className="w-4 h-4 stroke-3" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/*  MÓDULO INFERIOR CENTRADO (Notificaciones) */}
        <div className="w-full flex justify-center">
          {(() => {
            const mod = modulesData[4];
            const IconComponent = mod.icon;
            return (
              <Card className="bg-white border-neutral-200/60 shadow-md hover:shadow-lg transition-all rounded-[22px] overflow-hidden flex flex-col justify-between h-52.5 w-full md:max-w-140 relative p-2">
                <span className="absolute top-4 right-4 bg-neutral-100 text-[10px] text-neutral-400 font-medium px-2.5 py-0.5 rounded-full">
            
                </span>
                <CardHeader className="flex flex-row gap-4 items-start pt-6 px-6">
                  <div className="bg-[#2B3A42] text-white p-3.5 rounded-[16px] shadow-sm">
                    <IconComponent className="w-6 h-6"  onClick={() => navigate(mod.path)} />
                  </div>
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <CardTitle className="text-xl font-bold text-neutral-800 text-left"  onClick={() => navigate(mod.path)}>{mod.title}</CardTitle>
                    <CardDescription className="text-base text-neutral-400 text-left leading-snug">{mod.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-end items-center border-t border-neutral-50 py-3 px-6 mt-auto">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(mod.path)}
                    className="text-[#1a558b] hover:text-[#154673] hover:bg-blue-50/50 font-bold text-sm flex items-center gap-1.5 p-0"
                  >
                    Acceder <FiChevronRight className="w-4 h-4 stroke-" />
                  </Button>
                </CardContent>
              </Card>
            );
          })()}
        </div>

      </main>
    </div>
  );
};

export default HomePage;