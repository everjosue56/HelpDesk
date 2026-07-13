
import { useAreasDashboard } from '../hooks/useAreasDashboard';
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
import { MapPin, Info, RefreshCw, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAgencies } from '../../../administrative/agencies/hooks/useAgencies';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const AreasDashboardPage: React.FC = () => {

    const {
        year,
        setYear,
        month,
        setMonth,
        idAgency,
        setIdAgency,
        areasRecords,
        kpis,
        isLoading
    } = useAreasDashboard(2026);

    // --- CONFIGURACIÓN DE DATA  ---
    const labels = areasRecords.map(a => a.areaNombre);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Cantidad de Tickets',
                data: areasRecords.map(a => a.cantidadTickets),
                backgroundColor: '#d9a406',
                borderRadius: 6,
                barThickness: 40,
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
                        const item = areasRecords[context.dataIndex];
                        return ` Tickets: ${item.cantidadTickets} (${item.porcentajeDelTotal}%)`;
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11, weight: 'bold' as const } } },
            y: { border: { dash: [5, 5] }, grid: { color: '#f1f5f9' }, ticks: { color: '#9ca3af', font: { size: 11, weight: 'bold' as const } } }
        }
    };

    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const yearsOptions = Array.from({ length: 5 }, (_, index) => currentYear - index);

    const mesesOpciones = [
        { num: 1, name: "Enero" }, { num: 2, name: "Febrero" }, { num: 3, name: "Marzo" },
        { num: 4, name: "Abril" }, { num: 5, name: "Mayo" }, { num: 6, name: "Junio" },
        { num: 7, name: "Julio" }, { num: 8, name: "Agosto" }, { num: 9, name: "Septiembre" },
        { num: 10, name: "Octubre" }, { num: 11, name: "Noviembre" }, { num: 12, name: "Diciembre" }
    ];

    // catálogo de agencias
    const { agencies } = useAgencies('', '', 1, 100);

    if (isLoading && areasRecords.length === 0) {
        return (
            <div className="p-6 bg-[#f8f9fa] min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-bold text-slate-700 animate-pulse shadow-sm max-w-md w-full">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-3 text-[#1a558b]" />
                    Generando análisis de carga por áreas operativas...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

            {/* Breadcrumbs */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors" onClick={() => navigate("/dashboard")}>Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="hover:text-[#1a558b] text-neutral-400 font-semibold select-none" onClick={() => navigate("/dashboard/sla")}>Dashboard</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Áreas</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Áreas
                </h1>
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

                {/* Cabecera del Dashboard */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">KPI´S de Áreas (Distribución por Periodo)</h2>
                        <p className="text-xs text-gray-400">Gestiona todos los departamentos y sus flujos de incidencias</p>
                    </div>

                    {/* FILTROS DINÁMICOS */}
                    <div className="flex flex-col sm:flex-row gap-x-6 gap-y-3 sm:items-center w-full sm:w-auto sm:flex-wrap justify-end">

                        {/* Selector de Agencia */}

                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                            <label className="text-sm font-bold text-slate-500 whitespace-nowrap">Filtrar por Agencia:</label>
                            <div className="flex items-center gap-1.5 w-full sm:w-auto">
                                <Select
                                    onValueChange={(val) => setIdAgency(val ? Number(val) : undefined)}
                                    value={idAgency ? String(idAgency) : ""}
                                >
                                    <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full sm:w-52 bg-white select-none shadow-none flex items-center justify-between">
                                        <span className="max-w-35 truncate text-left block">
                                            <SelectValue placeholder="Todas las agencias" />
                                        </span>
                                    </SelectTrigger>

                                    <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                        {agencies?.map((agency) => (
                                            <SelectItem key={agency.id} value={String(agency.id)} className="cursor-pointer text-sm">
                                                {agency.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {idAgency && (
                                    <button
                                        onClick={() => setIdAgency(undefined)}
                                        className="p-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 rounded-xl text-slate-500 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                                        title="Limpiar filtro de agencia"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Selector de Año */}

                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
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

                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
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

                    {/* Tarjeta 2: Total Áreas */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28 relative">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Total Áreas con Reportes</p>
                            <p className="text-3xl font-bold text-slate-800 font-mono">
                                {String(kpis.totalAreas).padStart(2, '0')}
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                            <MapPin className="h-6 w-6" />
                        </div>
                    </div>

                </div>

                {/* GRÁFICO DE BARRAS  */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3">Carga de Incidencias por Área Operativa</h3>
                    <div className="relative h-85 w-full">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

            </div>
        </div >
    );
};