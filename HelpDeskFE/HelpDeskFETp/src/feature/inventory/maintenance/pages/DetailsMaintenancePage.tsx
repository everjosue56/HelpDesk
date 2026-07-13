import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMaintenances } from '../hooks/useMaintenances'; 
import { Copy, Edit3, ArrowLeft, Loader2, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export const DetailsMaintenancePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const maintenanceId = Number(id);

    const { maintenance, isFetching, getMaintenanceById } = useMaintenances('', 1, 1);

    // Cargar la información al montar o cambiar el ID
    useEffect(() => {
        if (maintenanceId) {
            getMaintenanceById(maintenanceId);
        }
    }, [maintenanceId, getMaintenanceById]);

    // Función interactiva para el botón "Copiar Datos"
    const handleCopyClipboard = async () => {
        if (!maintenance) return;

        const textToCopy = `
            Tipo de Mantenimiento: ${maintenance.maintenanceTypeName}
            Marca Dispositivo: ${maintenance.deviceBrand}
            Tiempo Demorado: ${formatExecutionTime(maintenance.executionTime)}
            Area: ${maintenance.areaName}
            Descripcion General: ${maintenance.deviceFullDescription}
            Fecha Notificacion: ${formatDateTime(maintenance.notificationDate)}
            Detalles: ${maintenance.details}
            Fecha Realizado: ${formatDateTime(maintenance.completionDate)}
        `.trim().replace(/^[ \t]+/gm, ''); 

        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success("Datos copiados al portapapeles", {
                description: "La ficha técnica del mantenimiento ha sido copiada."
            });
        } catch (err) {
            console.error("Error al copiar al portapapeles: ", err);
            toast.error("No se pudo copiar la información");
        }
    };

    // Formateador de Fecha y Hora
    const formatDateTime = (dateStr?: string) => {
        if (!dateStr || dateStr.startsWith('0001-01-01')) return 'N/A';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('es-HN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        }).format(date);
    };

    const formatExecutionTime = (timeValue?: number) => {
        if (timeValue === undefined || timeValue === null) return 'N/A';
        
        const hours = Math.floor(timeValue / 60);
        const minutes = timeValue % 60;
        
        if (hours > 0 && minutes > 0) return `${hours} Horas y ${minutes} Minutos`;
        if (hours > 0) return `${hours} Horas`;
        return `${minutes} Minutos`;
    };

    // Estado de carga (Loading)
    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 animate-fadeIn text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1e5f8a]" />
                <p className="text-sm font-medium">Sincronizando detalles del mantenimiento...</p>
            </div>
        );
    }

    // En caso de que el ID no devuelva nada
    if (!maintenance) {
        return (
            <div className="p-6 text-center space-y-4 animate-fadeIn">
                <p className="text-gray-500 font-medium">No se encontraron los detalles del mantenimiento solicitado.</p>
                <button
                    onClick={() => navigate('/dashboard/maintenance')} 
                    className="inline-flex items-center gap-2 text-sm text-[#1e5f8a] hover:underline cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver al listado
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">

            {/* Breadcrumbs e Historial */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inventario</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/maintenance')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Mantenimiento</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Detalles</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Mantenimiento
                </h1>
            </div>

            {/* ─── TARJETA CONTENEDORA PRINCIPAL ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8 relative">

                {/* Cabecera Interna: Títulos y Botones de Acción */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700 hidden sm:block">
                            <Wrench className="h-6 w-6 text-[#1a558b]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Detalles de Mantenimiento</h2>
                            <p className="text-sm text-gray-400 mt-0.5">Detalles de dispositivo seleccionado</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Botón Copiar Datos */}
                        <button
                            onClick={handleCopyClipboard}
                            className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar Datos
                        </button>

                        {/* Botón Editar Mantenimiento */}
                        <button
                            onClick={() => navigate(`/dashboard/maintenance/edit/${maintenance.id}`)}
                            className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                            <Edit3 className="h-3.5 w-3.5" />
                            Editar Mantenimiento
                        </button>
                    </div>
                </div>

                {/* ─── GRID DE INFORMACIÓN INTEGRAL ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">

                    {/* Fila 1 */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Tipo de Mantenimiento</h3>
                        <p className="text-sm text-gray-500 font-medium select-text">{maintenance.maintenanceTypeName}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Marca Dispositivo</h3>
                        <p className="text-sm text-gray-500 font-medium select-text">{maintenance.deviceBrand}</p>
                    </div>

                    {/* Fila 2 */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Tiempo Demorado</h3>
                        <p className="text-sm text-gray-500 font-medium">{formatExecutionTime(maintenance.executionTime)}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Area</h3>
                        <p className="text-sm text-gray-500 font-medium">{maintenance.areaName}</p>
                    </div>

                    {/* Fila 3 */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Descripcion General</h3>
                        <p className="text-sm text-gray-500 font-medium select-text">{maintenance.deviceFullDescription}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Fecha Notificacion</h3>
                        <p className="text-sm text-gray-500 font-medium">{formatDateTime(maintenance.notificationDate)}</p>
                    </div>

                    {/* Fila 4 */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Detalles</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed whitespace-pre-line select-text">
                            {maintenance.details || 'Sin detalles registrados.'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Fecha Realizado</h3>
                        <p className="text-sm text-gray-500 font-medium">{formatDateTime(maintenance.completionDate)}</p>
                    </div>

                </div>

                {/* ─── PIE DE PÁGINA DE LA TARJETA ─── */}
                <div className="pt-8 flex items-center gap-4 text-xs font-mono text-gray-400 border-t border-gray-100 pb-6">
                    <span>Id:{maintenance.id}</span>
                    <span>Creado: {maintenance.createdDate ? new Date(maintenance.createdDate).toLocaleDateString('es-HN') : 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};