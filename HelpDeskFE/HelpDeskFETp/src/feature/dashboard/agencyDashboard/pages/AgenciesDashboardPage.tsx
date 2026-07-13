import React from 'react';
import { useAgenciesDashboard } from '../hooks/useAgenciesDashboard';
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
import { Building2, Info, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../@/components/ui/select';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const AgenciesDashboardPage: React.FC = () => {
    const {
        year,
        setYear,
        month,
        setMonth,
        agenciesRecords,
        kpis,
        isLoading
    } = useAgenciesDashboard(2026);

    // --- CONFIGURACIÓN DE DATA PARA LAS BARRAS AGRUPADAS ---
    const labels = agenciesRecords.map(a => a.agenciaNombre.replace(" users", ""));

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Total Tickets',
                data: agenciesRecords.map(a => a.totalTickets),
                backgroundColor: '#1e5f8a',
                borderRadius: 6,
                barThickness: 40,
            },
            {
                label: 'Tickets Críticos',
                data: agenciesRecords.map(a => a.ticketsCriticos),
                backgroundColor: '#ef4444',
                borderRadius: 6,
                barThickness: 40,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    boxWidth: 12,
                    font: { size: 11, weight: 'bold' as const },
                    color: '#475569'
                }
            },
            tooltip: { padding: 10, bodyFont: { weight: 'bold' as const } }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11, weight: 'bold' as const } } },
            y: { border: { dash: [5, 5] }, grid: { color: '#f1f5f9' }, ticks: { color: '#9ca3af', font: { size: 11, weight: 'bold' as const } } }
        }
    };

    const navigate = useNavigate()
    const currentYear = new Date().getFullYear();
    const yearsOptions = Array.from({ length: 5 }, (_, index) => currentYear - index);

    const mesesOpciones = [
        { num: 1, name: "Enero" }, { num: 2, name: "Febrero" }, { num: 3, name: "Marzo" },
        { num: 4, name: "Abril" }, { num: 5, name: "Mayo" }, { num: 6, name: "Junio" },
        { num: 7, name: "Julio" }, { num: 8, name: "Agosto" }, { num: 9, name: "Septiembre" },
        { num: 10, name: "Octubre" }, { num: 11, name: "Noviembre" }, { num: 12, name: "Diciembre" }
    ];

    if (isLoading && agenciesRecords.length === 0) {
        return (
            <div className="p-6 bg-[#f8f9fa] min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-bold text-slate-700 animate-pulse shadow-sm max-w-md w-full">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-3 text-[#1a558b]" />
                    Generando análisis de carga por agencias...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

            {/* Historial superior (Breadcrumbs) */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors" onClick={() => navigate("/dashboard")}>Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="hover:text-[#1a558b] text-neutral-400 font-semibold select-none" onClick={() => navigate("/dashboard/sla")}>Dashboard</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Agencias</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Agencias
                </h1>
            </div>

            {/* CONTENEDOR PRINCIPAL DEL LISTADO */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

                {/* Cabecera del Dashboard */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">KPI´S de Agencias (Filtro por Periodo)</h2>
                        <p className="text-xs text-gray-400">Gestiona todas las sucursales y sus cargas de soporte en el tiempo</p>
                    </div>

                    {/* SELECTORES DE FILTRADO*/}
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">

                        {/* Selector de Año */}
                        <div className="flex items-center gap-2 w-full sm:max-w-xs">
                            <label className="text-sm font-bold text-slate-500 whitespace-nowrap">Filtrar por año:</label>
                            <Select onValueChange={(val) => setYear(Number(val))} value={String(year)}>
                                <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full sm:w-32 bg-white select-none shadow-none">
                                    <SelectValue placeholder="Año" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-sm">
                                    {yearsOptions.map((y) => (
                                        <SelectItem key={y} value={String(y)} className="cursor-pointer text-sm">
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Selector de Mes */}
                        <div className="flex items-center gap-2 w-full sm:max-w-xs">
                            <label className="text-sm font-bold text-slate-500 whitespace-nowrap">Filtrar por mes:</label>
                            <Select
                                onValueChange={(val) => setMonth(val ? Number(val) : undefined)}
                                value={month ? String(month) : ""}
                            >
                                <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full sm:w-36 bg-white select-none shadow-none">
                                    <SelectValue placeholder="Todo el año" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-sm">
                                    {mesesOpciones.map((m) => (
                                        <SelectItem key={m.num} value={String(m.num)} className="cursor-pointer text-sm">
                                            {m.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                </div>

                {/* TARJETAS DE KPIS SUPERIORES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

                    {/* Tarjeta 1: Incidentes Reportados */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28 relative">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Incidentes Reportados</p>
                            <p className="text-3xl font-bold text-[#1a558b] font-mono">
                                {String(kpis.totalTickets).padStart(2, '0')}
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                            <Info className="h-6 w-6" />
                        </div>
                    </div>

                    {/* Tarjeta 2: Total Agencias */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28 relative">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Total Agencias</p>
                            <p className="text-3xl font-bold text-slate-800 font-mono">
                                {String(kpis.totalAgencias).padStart(2, '0')}
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                    </div>

                </div>

                {/* SECCIÓN DEL GRÁFICO  */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3">Carga de Tickets por Agencia</h3>
                    <div className="relative h-80 w-full">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

            </div>
        </div>
    );
};