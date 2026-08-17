import React, { useRef, useState } from 'react';
import { useMaintenanceDashboard } from '../hooks/useMaintenanceDashboard';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
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
    ArcElement,
    Filler
} from 'chart.js';
import { Wrench, Calendar, Clock, AlertTriangle, RefreshCw, FileSpreadsheet, FileText,  } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { downloadMaintenanceDashboardPdf } from '../utils/generateMaintenanceDashboardPdf';
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
    ArcElement,
    Filler
);

export const MaintenanceDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const {
        year,
        setYear,
        selectedMonth,
        setSelectedMonth,
        data,
        isLoading,
        refresh,
        downloadExcel,
    } = useMaintenanceDashboard(currentYear);

    const dashboardRef = useRef<HTMLDivElement>(null);
    const [isExportingExcel, setIsExportingExcel] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const yearsOptions = Array.from({ length: 5 }, (_, index) => currentYear - index);

    const mesesOpciones = [
        { num: 1, name: "Enero" }, { num: 2, name: "Febrero" }, { num: 3, name: "Marzo" },
        { num: 4, name: "Abril" }, { num: 5, name: "Mayo" }, { num: 6, name: "Junio" },
        { num: 7, name: "Julio" }, { num: 8, name: "Agosto" }, { num: 9, name: "Septiembre" },
        { num: 10, name: "Octubre" }, { num: 11, name: "Noviembre" }, { num: 12, name: "Diciembre" }
    ];

    const selectedMonthName = mesesOpciones.find(m => m.num === selectedMonth)?.name ?? 'Todo el año';
    const reportObjective = 'Este reporte ejecutivo consolida la situación del programa de mantenimiento preventivo para evaluar el cumplimiento del plan e identificar riesgos operativos.';

    //  EXPORTAR PDF

    const handleExportPDF = () => {
        if (!data) return;
        try {
            setIsExportingPdf(true);
            downloadMaintenanceDashboardPdf(year, data, selectedMonth);
            toast.success("Informe de mantenimientos generado en PDF con éxito");
        } catch (error) {
            console.error('Error al generar el PDF de Mantenimiento:', error);
            toast.error("Ocurrió un error al construir el informe PDF.");
        } finally {
            setIsExportingPdf(false);
        }
    };
    //  EXPORTAR EXCEL
    const handleExportExcel = async () => {
        setIsExportingExcel(true);
        try {
            await downloadExcel();
        } catch (error) {
            console.error("Error al descargar Excel:", error);
        } finally {
            setIsExportingExcel(false);
        }
    };

    if (isLoading && !data) {
        return (
            <div className="p-6 bg-[#f8f9fa] min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-bold text-slate-700 animate-pulse shadow-sm max-w-md w-full">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-3 text-[#1a558b]" />
                    Generando análisis estadístico de mantenimientos...
                </div>
            </div>
        );
    }

    // Configuración de Datos para Gráficos
    const estadoLabels = data?.porEstado.map(e => e.estado) || [];
    const estadoData = data?.porEstado.map(e => e.cantidad) || [];
    const estadoColors = data?.porEstado.map(e => {
        if (e.color === 'red') return '#ef4444';
        if (e.color === 'yellow') return '#f59e0b';
        if (e.color === 'blue') return '#3b82f6';
        if (e.color === 'green') return '#10b981';
        return '#6b7280';
    }) || [];

    const doughnutChartData = {
        labels: estadoLabels,
        datasets: [{
            data: estadoData,
            backgroundColor: estadoColors,
            hoverOffset: 4,
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };

    const histLabels = data?.historialMensual.map(h => h.mesNombre.charAt(0).toUpperCase() + h.mesNombre.slice(1)) || [];
    const histData = data?.historialMensual.map(h => h.cantidad) || [];

    const barChartData = {
        labels: histLabels,
        datasets: [{
            label: 'Mantenimientos Completados',
            data: histData,
            backgroundColor: '#1a558b',
            borderRadius: 8,
            barThickness: 30
        }]
    };

    const freqLabels = data?.porFrecuencia.map(f => f.frecuencia) || [];
    const freqData = data?.porFrecuencia.map(f => f.cantidad) || [];

    const pieChartData = {
        labels: freqLabels,
        datasets: [{
            data: freqData,
            backgroundColor: ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#c084fc'],
            borderWidth: 1
        }]
    };

    const areaLabels = data?.porArea.map(a => a.area) || [];
    const areaData = data?.porArea.map(a => a.cantidad) || [];

    const areaChartData = {
        labels: areaLabels,
        datasets: [{
            label: 'Mantenimientos',
            data: areaData,
            backgroundColor: '#8b5cf6',
            borderRadius: 6,
            barThickness: 25
        }]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { padding: 10, bodyFont: { weight: 'bold' as const } }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 10, weight: 'bold' as const } } },
            y: { 
                border: { dash: [5, 5] }, 
                grid: { color: '#f1f5f9' }, 
                ticks: { 
                    color: '#9ca3af', 
                    font: { size: 10, weight: 'bold' as const },
                    stepSize: 1,
                    callback: (value: any) => {
                        if (typeof value === 'number' && value % 1 === 0) return value;
                        return value;
                    }
                } 
            }
        }
    };

    const horizontalBarOptions = {
        ...commonOptions,
        indexAxis: 'y' as const,
        scales: {
            x: { 
                border: { dash: [5, 5] }, 
                grid: { color: '#f1f5f9' }, 
                ticks: { 
                    color: '#9ca3af', 
                    font: { size: 10, weight: 'bold' as const },
                    stepSize: 1,
                    callback: (value: any) => {
                        if (typeof value === 'number' && value % 1 === 0) return value;
                        return value;
                    }
                } 
            },
            y: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 10, weight: 'bold' as const } } }
        }
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">
            {/* Cabecera / Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                        <span className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors" onClick={() => navigate("/dashboard")}>Inicio</span>
                        <span className="text-neutral-300 font-normal">&gt;</span>
                        <span className="text-neutral-400 font-semibold select-none">Dashboard</span>
                        <span className="text-neutral-300 font-normal">&gt;</span>
                        <span className="text-neutral-400 font-semibold">Mantenimientos</span>
                    </div>
                    <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                        Estadísticas de Mantenimiento
                    </h1>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex flex-wrap items-center gap-3">

                    <button
                        onClick={handleExportPDF}
                        disabled={isExportingPdf}
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-sm h-10 px-4 cursor-pointer transition-colors text-sm disabled:opacity-50 border-none"
                    >
                        <FileText className="w-4 h-4" />
                        {isExportingPdf ? 'Generando...' : 'Exportar PDF'}
                    </button>
                    <button
                        onClick={handleExportExcel}
                        disabled={isExportingExcel}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-sm h-10 px-4 cursor-pointer transition-colors text-sm disabled:opacity-50 border-none"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        {isExportingExcel ? 'Exportando...' : 'Exportar Excel'}
                    </button>
                    <button
                        onClick={refresh}
                        className="rounded-xl bg-[#1a558b] hover:bg-[#15436f] text-white font-bold flex items-center gap-2 shadow-sm h-10 px-4 border-none cursor-pointer transition-colors text-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Actualizar
                    </button>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL DE REPORTES */}
            <div ref={dashboardRef} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                
                {/*   ENCABEZADO EXCLUSIVO PARA EL PDF */}
                <div id="pdf-header" className="hidden p-4 border-b border-gray-200 mb-2">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#1a558b] text-white font-black px-3 py-2 rounded-xl text-lg">
                                HD
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#1a558b] uppercase tracking-wide">
                                    Sistema HelpDesk
                                </h2>
                                <p className="text-xs text-slate-500 font-semibold">
                                    Reporte Oficial de Mantenimiento Preventivo
                                </p>
                            </div>
                        </div>

                        <div className="text-right text-xs text-slate-500 space-y-1 max-w-95">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-[#1a558b] font-black">Reporte ejecutivo</p>
                            <p className="font-bold text-slate-700">{reportObjective}</p>
                            <p><span className="font-bold">Fecha de Emisión:</span> {new Date().toLocaleDateString('es-HN')}</p>
                            <p><span className="font-bold">Periodo:</span> {selectedMonth ? `${selectedMonthName} ${year}` : `Anual ${year}`}</p>
                            <p><span className="font-bold">Clasificación:</span> Confidencial / Auditoría Interna</p>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Métricas Clave de Prevención</h2>
                        <p className="text-xs text-gray-400">Distribución y cumplimiento del plan anual de mantenimiento preventivo</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">
                        <div className="flex items-center gap-2 w-full sm:max-w-xs">
                            <Select onValueChange={(val) => setYear(Number(val))} value={String(year)}>
                                <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full sm:w-32 bg-white select-none shadow-none">
                                    <SelectValue placeholder="Año" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-sm">
                                    {yearsOptions.map(y => (
                                        <SelectItem key={y} value={String(y)} className="cursor-pointer text-sm">{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:max-w-xs">
                            <Select
                                onValueChange={(val) => setSelectedMonth(val === 'todos' ? undefined : Number(val))}
                                value={selectedMonth === undefined ? 'todos' : String(selectedMonth)}
                            >
                                <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full sm:w-36 bg-white select-none shadow-none">
                                    <SelectValue placeholder="Mes" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-sm">
                                    <SelectItem value="todos" className="cursor-pointer text-sm">Todos los meses</SelectItem>
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
                            <p className="text-sm font-medium text-gray-500">Mantenimientos Activos</p>
                            <p className="text-3xl font-bold text-[#1a558b] font-mono">{String(data?.totalProgramados || 0).padStart(2, '0')}</p>
                        </div>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28 relative">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Realizados en Periodo</p>
                            <p className="text-3xl font-bold text-emerald-600 font-mono">{String(data?.totalRealizados || 0).padStart(2, '0')}</p>
                        </div>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                            <Wrench className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28 relative">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Mantenimientos Vencidos</p>
                            <p className={`text-3xl font-bold font-mono ${(data?.totalVencidos || 0) > 0 ? 'text-red-500' : 'text-slate-800'}`}>
                                {String(data?.totalVencidos || 0).padStart(2, '0')}
                            </p>
                        </div>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28 relative">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Tiempo Invertido</p>
                            <p className="text-3xl font-bold text-slate-800 font-mono">{(data?.tiempoTotalEjecucion || 0).toFixed(1)} hrs</p>
                        </div>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* FILA DE GRÁFICOS 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                    {/* Gráfico Doughnut: Estado */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-80">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Estado General de Mantenimientos</h3>
                        <div className="relative flex-1 flex items-center justify-center">
                            {estadoData.length > 0 ? (
                                <div className="w-56 h-56">
                                    <Doughnut
                                        data={doughnutChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    position: 'bottom',
                                                    labels: { boxWidth: 12, font: { size: 10, weight: 'bold' } }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400">Sin datos de estado en este periodo</p>
                            )}
                        </div>
                    </div>

                    {/* Gráfico Bar: Historial Mensual */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-80 lg:col-span-2">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Mantenimientos Ejecutados por Mes</h3>
                        <div className="flex-1 min-h-0">
                            {histData.length > 0 ? (
                                <Bar data={barChartData} options={commonOptions} />
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-xs text-gray-400">Sin datos mensuales para el año seleccionado</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FILA DE GRÁFICOS 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico Pie: Frecuencia */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-80">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Distribución por Frecuencia</h3>
                        <div className="relative flex-1 flex items-center justify-center">
                            {freqData.length > 0 ? (
                                <div className="w-56 h-56">
                                    <Pie
                                        data={pieChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    position: 'bottom',
                                                    labels: { boxWidth: 12, font: { size: 10, weight: 'bold' } }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400">Sin datos de frecuencia</p>
                            )}
                        </div>
                    </div>

                    {/* Gráfico Bar Horizontal: Áreas */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-80 lg:col-span-2">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Mantenimientos por Área Operativa</h3>
                        <div className="flex-1 min-h-0">
                            {areaData.length > 0 ? (
                                <Bar data={areaChartData} options={horizontalBarOptions} />
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-xs text-gray-400">Sin datos de áreas registrados</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/*  PIE DE PÁGINA   */}
                <div id="pdf-footer" className="hidden pt-8 border-t border-gray-200 mt-8 text-xs text-slate-500">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="font-bold text-slate-700">Generado por: Administrador del Sistema</p>
                            <p className="text-[10px]">Este documento es un reporte consolidado generado automáticamente.</p>
                        </div>
                        <div className="text-center w-48 border-t border-slate-300 pt-1">
                            <p className="font-semibold text-slate-600">Firma de Conformidad</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};