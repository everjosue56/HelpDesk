import React, { useState } from 'react';
import { useSlaDashboard } from '../hooks/useSlaDashboard';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { AlertCircle, Clock, FileText, Info, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { SlaGoalsModal } from '../components/SlaGoalsModal';
import { Button } from '../../../../../@/components/ui/button';
import { FiSettings } from 'react-icons/fi';
import { PdfReportLayout } from '@/shared/PdfReportLayout';
import { downloadSlaReportPdf } from '../utils/generateSlaReportPdf';
import { toast } from 'sonner';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const SlaDashboardPage: React.FC = () => {
    //   Extraemos setYear para refrescar la data de los gráficos al actualizar metas
    const {
        year,
        setYear,
        selectedMonth,
        setSelectedMonth,
        monthlyRecords,
        activeKpiData,
        isLoading
    } = useSlaDashboard(2026);

    const mesesOpciones = [
        { num: 1, name: "Enero" }, { num: 2, name: "Febrero" }, { num: 3, name: "Marzo" },
        { num: 4, name: "Abril" }, { num: 5, name: "Mayo" }, { num: 6, name: "Junio" },
        { num: 7, name: "Julio" }, { num: 8, name: "Agosto" }, { num: 9, name: "Septiembre" },
        { num: 10, name: "Octubre" }, { num: 11, name: "Noviembre" }, { num: 12, name: "Diciembre" }
    ];

    const navigate = useNavigate();
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);


    const handleRefreshData = () => {
        const currentYear = year;
        setYear(0); // Estado temporal para limpiar
        setTimeout(() => setYear(currentYear), 50); // Restablece y re-ejecuta
    };

    // --- CONFIGURACIÓN DE DATA PARA LOS GRÁFICOS ---
    const labels = monthlyRecords.map(m => m.mesNombre.charAt(0).toUpperCase() + m.mesNombre.slice(1));

    const lineChartData = {
        labels,
        datasets: [
            {
                label: 'Meta',
                data: monthlyRecords.map(m => m.meta),
                borderColor: '#1a558b',
                backgroundColor: 'transparent',
                borderWidth: 2.5,
                tension: 0.2,
                pointRadius: 3,
            },
            {
                label: 'Meta Alcanzada',
                data: monthlyRecords.map(m => m.metaAlcanzada),
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                borderWidth: 2.5,
                tension: 0.2,
                pointRadius: 3,
            }
        ]
    };

    const incidentChartData = {
        labels,
        datasets: [
            {
                label: 'Incidentes Reportados',
                data: monthlyRecords.map(m => m.incidentesReportados),
                backgroundColor: '#d9a406',
                borderRadius: 8,
                barThickness: 45,
            }
        ]
    };

    const timeChartData = {
        labels,
        datasets: [
            {
                label: 'Tiempo Promedio de Resolución',
                data: monthlyRecords.map(m => m.tiempoPromedioResolucion),
                backgroundColor: '#1e5f8a',
                borderRadius: 8,
                barThickness: 45,
            }
        ]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { padding: 10, bodyFont: { weight: 'bold' as const } }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11, weight: 'bold' as const } } },
            y: { border: { dash: [5, 5] }, grid: { color: '#f1f5f9' }, ticks: { color: '#9ca3af', font: { size: 11, weight: 'bold' as const } } }
        }
    };

    const handleDownloadPdf = () => {
        try {
            downloadSlaReportPdf(year, monthlyRecords, activeKpiData, selectedMonth);
            toast.success("Informe gerencial de SLA generado en PDF con éxito");
        } catch (error) {
            console.error('Error al generar el PDF del Dashboard SLA:', error);
            toast.error("Error al construir el informe PDF.");
        }
    };



    if (isLoading && monthlyRecords.length === 0) {
        return (
            <div className="p-6 bg-[#f8f9fa] min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-bold text-slate-700 animate-pulse shadow-sm max-w-md w-full">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-3 text-[#1a558b]" />
                    Generando análisis estadístico del SLA...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

            {/* Historial superior (Breadcrumbs) y Botón de Ajustes */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                        <span className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors" onClick={() => navigate("/dashboard")}>Inicio</span>
                        <span className="text-neutral-300 font-normal">&gt;</span>
                        <span className="hover:text-[#1a558b] text-neutral-400 font-semibold select-none" onClick={() => navigate("/dashboard/sla")}>Dashboard</span>
                        <span className="text-neutral-300 font-normal">&gt;</span>
                        <span className="text-neutral-400 font-semibold">Metas</span>
                    </div>
                    <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                        Metas TI
                    </h1>
                </div>
                <div className='flex flex-wrap items-center gap-3'>

                    <Button
                        onClick={handleDownloadPdf}
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-sm h-10 px-4 cursor-pointer transition-colors text-sm border-none"
                    >
                        <FileText className="w-4 h-4" />
                        Exportar PDF
                    </Button>
                    <Button
                        onClick={() => setIsGoalModalOpen(true)}
                        className="rounded-xl bg-[#1a558b] hover:bg-[#15436f] text-white font-bold flex items-center gap-2 shadow-sm h-10 px-4 self-start sm:self-auto"
                    >
                        <FiSettings className="w-4 h-4" />
                        Configurar Metas Mensuales
                    </Button>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <PdfReportLayout
                id="sla-dashboard-pdf-container"
                title="REPORTE DE CUMPLIMIENTO SLA"
                subtitle={`Análisis Estadístico de Acuerdos de Nivel de Servicio - Año ${year}`}
            >
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

                    {/* Cabecera Técnica del Dashboard */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">KPI'S de Metas (Vista Mensual Detallada)</h2>
                            <p className="text-xs text-gray-400">Visualización de métricas de cumplimiento de ANS institucionales</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">
                            <div className="flex items-center gap-2 w-full sm:max-w-xs">
                                <Select onValueChange={(val) => setYear(Number(val))} value={String(year)}>
                                    <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full sm:w-32 bg-white select-none shadow-none">
                                        <SelectValue placeholder="Año" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-sm">
                                        <SelectItem value="2025" className="cursor-pointer text-sm">2025</SelectItem>
                                        <SelectItem value="2026" className="cursor-pointer text-sm">2026</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:max-w-xs">
                                <Select onValueChange={(val) => setSelectedMonth(Number(val))} value={String(selectedMonth)}>
                                    <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full sm:w-36 bg-white select-none shadow-none">
                                        <SelectValue placeholder="Mes" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-sm">
                                        {mesesOpciones.map(m => (
                                            <SelectItem key={m.num} value={String(m.num)} className="cursor-pointer text-sm">{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* TARJETAS DE KPI SUPERIORES */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28 relative">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Incidentes Reportados</p>
                                <p className="text-3xl font-bold text-[#1a558b] font-mono">{String(activeKpiData.incidentesReportados).padStart(2, '0')}</p>
                            </div>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                                <Info className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28 relative">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Tiempo Promedio en Resolucion</p>
                                <p className="text-3xl font-bold text-slate-800 font-mono">{activeKpiData.tiempoPromedioResolucion?.toFixed(2) || "0.00"} H</p>
                            </div>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                                <Clock className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28 relative">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Alerta de Cumplimiento</p>
                                <p className={`text-2xl font-bold tracking-tight ${activeKpiData.cumplimiento === 'Alerta' || activeKpiData.cumplimiento === 'ALERTA' ? 'text-amber-500' : 'text-emerald-600'}`}>
                                    {activeKpiData.cumplimiento?.toUpperCase() || "SIN DATOS"}
                                </p>
                            </div>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Meta vs. Alcanzada</p>
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                        <span>Meta: {activeKpiData.meta}%</span>
                                        <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-slate-400 h-full" style={{ width: `${activeKpiData.meta}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                        <span>Alcanzada: {activeKpiData.metaAlcanzada?.toFixed(1) || "0.0"}%</span>
                                        <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-amber-500 h-full" style={{ width: `${Math.min(activeKpiData.metaAlcanzada || 0, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── SECCIÓN DE GRÁFICOS ─── */}
                    <div className="space-y-6 pt-2">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 gap-2">
                                <h3 className="text-sm font-bold text-slate-800">Evolución mensual de rendimiento de atención SLA</h3>
                                <div className="flex items-center gap-4 text-xs font-bold">
                                    <div className="flex items-center gap-1.5 text-[#1a558b]">
                                        <span className="w-3 h-0.5 bg-[#1a558b] inline-block"></span> Meta
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[#10b981]">
                                        <span className="w-3 h-0.5 bg-[#10b981] inline-block"></span> Meta Alcanzada
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-72 w-full">
                                <Line data={lineChartData} options={commonOptions} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                            <h3 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3">Incidentes Reportados por Mes</h3>
                            <div className="relative h-64 w-full">
                                <Bar data={incidentChartData} options={commonOptions} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                            <h3 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3">Tiempo Promedio de Resolución (H)</h3>
                            <div className="relative h-64 w-full">
                                <Bar data={timeChartData} options={commonOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </PdfReportLayout>

            <SlaGoalsModal
                isOpen={isGoalModalOpen}
                onClose={() => setIsGoalModalOpen(false)}
                year={year}
                currentData={monthlyRecords}
                onSuccess={handleRefreshData}
            />
        </div>
    );
};