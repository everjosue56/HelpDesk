import React from 'react';
import { useTechnicianDashboard } from '../hooks/useTechnicianDashboard';
import { useUsers } from '../../../administrative/users/hooks/useUser';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { UserCheck, Activity, Clock, RefreshCw, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../@/components/ui/select';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const TechnicianDashboardPage: React.FC = () => {
    const {
        year,
        setYear,
        month,
        setMonth,
        selectedUser,
        setSelectedUser,
        techRecords,
        kpis,
        isLoading
    } = useTechnicianDashboard(2026);

    const { users } = useUsers('', null, null, null, null, 1, 100);

    const labels = techRecords.map(t => t.tecnicoNombre);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Incidencias Resueltas',
                data: techRecords.map(t => t.ticketsResueltos),
                backgroundColor: '#1e5f8a', 
                borderRadius: 6,
                barThickness: 45,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                padding: 10,
                bodyFont: { weight: 'bold' as const },
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: function (context: any) {
                        const item = techRecords[context.dataIndex];
                        return ` Resueltos: ${item.ticketsResueltos} (MTTR: ${item.mttrHoras}h)`;
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11, weight: 'bold' as const } } },
            y: { border: { dash: [5, 5] }, grid: { color: '#f1f5f9' }, ticks: { color: '#9ca3af', font: { size: 11, weight: 'bold' as const } } }
        }
    };

    const currentYear = new Date().getFullYear();
    const yearsOptions = Array.from({ length: 5 }, (_, index) => currentYear - index);

    const mesesOpciones = [
        { num: 1, name: "Enero" }, { num: 2, name: "Febrero" }, { num: 3, name: "Marzo" },
        { num: 4, name: "Abril" }, { num: 5, name: "Mayo" }, { num: 6, name: "Junio" },
        { num: 7, name: "Julio" }, { num: 8, name: "Agosto" }, { num: 9, name: "Septiembre" },
        { num: 10, name: "Octubre" }, { num: 11, name: "Noviembre" }, { num: 12, name: "Diciembre" }
    ];

    const navigate = useNavigate()
    // Encontrar el nombre del técnico seleccionado para mostrar en la tarjeta de KPI
    const currentTechName = users?.find(u => u.id === selectedUser)?.userName || "Todos";

    if (isLoading && techRecords.length === 0) {
        return (
            <div className="p-6 bg-[#f8f9fa] min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-bold text-slate-700 animate-pulse shadow-sm max-w-md w-full">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-3 text-[#1a558b]" />
                    Sincronizando métricas de productividad de soporte TI...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

            {/* Historial superior   */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors" onClick={() => navigate("/dashboard")}>Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="hover:text-[#1a558b] text-neutral-400 font-semibold select-none" onClick={() => navigate("/dashboard/sla")}>Dashboard</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Técnicos</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Rendimiento Técnicos
                </h1>
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

                {/* Cabecera del Dashboard */}
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">KPI´S de Productividad (Equipo de Soporte TI)</h2>
                        <p className="text-xs text-gray-400">Analiza el volumen de resolución y tiempos de respuesta de los técnicos</p>
                    </div>

                    {/* TRIPLE FILTRO INTERACTIVO */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto">

                        {/* Selector de Año */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-slate-500 whitespace-nowrap">Año:</label>
                            <Select onValueChange={(val) => setYear(Number(val))} value={String(year)}>
                                <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full bg-white shadow-none">
                                    <SelectValue placeholder="Año" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-xl border border-gray-200 text-sm">
                                    {yearsOptions.map((y) => (
                                        <SelectItem key={y} value={String(y)} className="cursor-pointer text-sm">{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Selector de Mes */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-slate-500 whitespace-nowrap">Mes:</label>
                            <Select onValueChange={(val) => setMonth(val ? Number(val) : undefined)} value={month ? String(month) : ""}>
                                <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full bg-white shadow-none">
                                    <SelectValue placeholder="Todo el año" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-xl border border-gray-200 text-sm">
                                    {mesesOpciones.map((m) => (
                                        <SelectItem key={m.num} value={String(m.num)} className="cursor-pointer text-sm">{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Selector de Usuario Técnico */}
                        <div className="flex items-center gap-2 w-full">
                            <label className="text-sm font-bold text-slate-500 whitespace-nowrap">Técnico:</label>
                            <div className="flex items-center gap-1.5 w-full">
                                <Select onValueChange={(val) => setSelectedUser(val ? Number(val) : undefined)} value={selectedUser ? String(selectedUser) : ""}>
                                    <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full bg-white shadow-none">
                                        <SelectValue placeholder="Todos los Técnicos" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white rounded-xl border border-gray-200 text-sm">
                                        {users?.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)} className="cursor-pointer text-sm">{u.userName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedUser && (
                                    <button onClick={() => setSelectedUser(undefined)} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* TARJETAS DE KPIS SUPERIORES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    
                    {/* Tarjeta 1: Técnico Activo */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28 relative">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Técnico Analizado</p>
                            <p className="text-2xl font-bold text-[#1a558b] truncate max-w-40">
                                {currentTechName}
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                            <UserCheck className="h-6 w-6" />
                        </div>
                    </div>

                    {/* Tarjeta 2: Total Incidencias Resueltas */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28 relative">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Total Resueltas</p>
                            <p className="text-3xl font-bold text-slate-800 font-mono">
                                {String(kpis.totalResueltos).padStart(2, '0')}
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>

                    {/* Tarjeta 3: MTTR Promedio */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28 relative">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Tiempo de Solución Promedio</p>
                            <p className="text-3xl font-bold text-slate-800 font-mono">
                                {kpis.promedioMttr.toFixed(2)} H
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>

                </div>

                {/* SECCIÓN DEL GRÁFICO DE BARRAS */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3">Incidencias Resueltas por Usuario TI</h3>
                    <div className="relative h-85 w-full">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

            </div>
        </div>
    );
};