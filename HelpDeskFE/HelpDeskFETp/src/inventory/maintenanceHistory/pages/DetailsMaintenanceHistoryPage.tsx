import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMaintenanceHistory } from '../hooks/useMaintenanceHistory';
import { Copy, ArrowLeft, Loader2, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export const DetailsMaintenanceHistoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const historyId = Number(id);

    const { history, isFetching, getMaintenanceHistoryById } = useMaintenanceHistory(null, null, null, null, 1, 1);

    useEffect(() => {
        if (historyId) {
            getMaintenanceHistoryById(historyId);
        }
    }, [historyId, getMaintenanceHistoryById]);

    // Función interactiva para el botón "Copiar Datos" 
    const handleCopyClipboard = async () => {
        if (!history) return;

        const textToCopy = `
            Ficha de Historial de Mantenimiento
            ------------------------------------
            Técnico Responsable: ${history.technicalName}
            Correo del Técnico: ${history.technicalEmail}
            Marca/Modelo: ${history.deviceBrand}
            Código de Inventario: ${history.deviceCode}
            Tipo de Dispositivo: ${history.deviceType}
            Tiempo Demorado: ${formatExecutionTime(history.solutionTime)}
            Fecha de Creación: ${formatFecha(history.createdDate)}
            Detalles Técnicos: ${history.maintenanceDetails}
        `.trim().replace(/^[ \t]+/gm, '');

        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success("Ficha técnica copiada al portapapeles");
        } catch (err) {
            console.error("Error al copiar al portapapeles: ", err);
        }
    };

    // Formateador para convertir minutos a horas y minutos exactos 
    const formatExecutionTime = (totalMinutes: number) => {
        if (!totalMinutes) return "0 Minutos";
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        if (hours === 0) return `${minutes} Minutos`;
        if (minutes === 0) return `${hours} ${hours === 1 ? 'Hora' : 'Horas'}`;
        return `${hours} ${hours === 1 ? 'Hora' : 'Horas'} y ${minutes} ${minutes === 1 ? 'Minuto' : 'Minutos'}`;
    };

    const formatFecha = (fechaStr?: string) => {
        if (!fechaStr || fechaStr.startsWith('0001-01-01')) return 'No registrada';

        const fecha = new Date(fechaStr);
        return new Intl.DateTimeFormat('es-HN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(fecha).replace(',', '');
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 animate-fadeIn text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1e5f8a]" />
                <p className="text-sm font-medium">Sincronizando ficha técnica del historial...</p>
            </div>
        );
    }

    if (!history) {
        return (
            <div className="p-6 text-center space-y-4 animate-fadeIn">
                <p className="text-gray-500 font-medium">No se encontraron los detalles del historial solicitado.</p>
                <button
                    onClick={() => navigate('/dashboard/maintenancehistory')} 
                    className="inline-flex items-center gap-2 text-sm text-[#1e5f8a] hover:underline cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver al listado
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">

            {/* Historial superior  */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inventario</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/maintenancehistory')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Historial de Mantenimiento</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Detalles</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Historial de Mantenimiento
                </h1>
            </div>

            {/* ─── TARJETA CONTENEDORA PRINCIPAL ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8 relative">

                {/* Cabecera Interna */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700 hidden sm:block">
                            <Wrench className="h-6 w-6 text-[#1a558b]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Detalles de Historial de Mantenimiento</h2>
                            <p className="text-sm text-gray-400 mt-0.5">Detalles de Historial seleccionado</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCopyClipboard}
                            className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar Datos
                        </button>
                    </div>
                </div>

                {/* ─── GRID DE INFORMACIÓN ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

                    {/* Nombre del Técnico */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Nombre del Tecnico</h3>
                        <p className="text-sm text-slate-800 font-medium select-text">{history.technicalName}</p>
                    </div>

                    {/* Marca Dispositivo */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Marca Dispositivo</h3>
                        <p className="text-sm text-slate-800 font-medium select-text">{history.deviceBrand}</p>
                    </div>

                    {/* Tiempo Demorado */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Tiempo Demorado</h3>
                        <p className="text-sm text-gray-500 font-medium">{formatExecutionTime(history.solutionTime)}</p>
                    </div>

                    {/* Código de Inventario */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Codigo Dispositivo</h3>
                        <p className="text-sm text-slate-700 font-mono font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg inline-block select-text">
                            {history.deviceCode}
                        </p>
                    </div>

                    {/* Tipo de Dispositivo */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Tipo de Dispositivo</h3>
                        <p className="text-sm text-gray-500 font-medium">{history.deviceType}</p>
                    </div>

                    {/* Fecha Creación */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Fecha Creacion</h3>
                        <p className="text-sm text-gray-500 font-medium">{formatFecha(history.createdDate)}</p>
                    </div>

                    {/* Detalles Técnicos */}
                    <div className="space-y-1 md:col-span-1">
                        <h3 className="text-sm font-bold text-slate-600">Detalles</h3>
                        <p className="text-sm text-slate-600 bg-neutral-50 border border-neutral-100 rounded-xl p-4 leading-relaxed whitespace-pre-line select-text">
                            {history.maintenanceDetails}
                        </p>
                    </div>

                    {/* Correo del Técnico */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Correo del Tecnico</h3>
                        <p className="text-sm text-gray-500 font-mono font-medium select-text">{history.technicalEmail}</p>
                    </div>

                </div>

                {/* ─── PIE DE PÁGINA DE LA TARJETA ─── */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-400">
                    <div className="flex gap-4">
                        <span>Id: {history.id}</span>
                        <span>Creado: {formatFecha(history.createdDate).split(' ')[0]}</span>
                    </div>

                </div>

            </div>
        </div>
    );
};