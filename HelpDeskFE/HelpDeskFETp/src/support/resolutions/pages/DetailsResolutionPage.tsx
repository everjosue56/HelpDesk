import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResolutions } from '../hooks/useResolutions'; 
import { Copy, Edit3, ArrowLeft, Loader2, Wrench, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const DetailsResolutionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const resolutionId = Number(id);

    const [isLoadingData, setIsLoadingData] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [resolution, setResolution] = useState<any | null>(null);

    const { getResolutionById } = useResolutions('', 1, 1);

    useEffect(() => {
        let isMounted = true;
        const fetchResolution = async () => {
            if (!resolutionId) return;
            try {
                setIsLoadingData(true);
                const res = await getResolutionById(resolutionId);
                
                if (isMounted && res) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const resAny = res as any;
                    const resData = resAny?.data || resAny?.Data || resAny;
                    setResolution(resData);
                }
            } catch (error) {
                console.error("Error cargando resolución por ID:", error);
                toast.error("No se pudo recuperar la información de la resolución.");
            } finally {
                if (isMounted) setIsLoadingData(false);
            }
        };

        fetchResolution();
        return () => { isMounted = false; };
    }, [resolutionId, getResolutionById]);

    const handleCopyClipboard = async () => {
        if (!resolution) return;

        const textToCopy = `
            Ficha de Resolución #${String(resolution.id).padStart(3, '0')}
            Ticket Asociado: #${String(resolution.idTicket).padStart(3, '0')} - ${resolution.ticketDescription || 'N/A'}
            Creador del Ticket: ${resolution.ticketCreatorName || 'N/A'}
            Acción Tomada: ${resolution.actionTaken}
            Problema Raíz: ${resolution.rootCause}
            Medidas Preventivas: ${resolution.preventiveMeasures || 'N/A'}
            Observación: ${resolution.observation || 'N/A'}
            Segunda Observación: ${resolution.secondObservation || 'N/A'}
            Tiempo de Solución: ${resolution.solutionTime} H
            Usuario TI: ${resolution.userName}
            Dispositivo: ${resolution.deviceName || 'N/A'}
            Prioridad: ${resolution.priorityName}
            Estado de Solución: ${resolution.solutionStatusName}
        `.trim().replace(/^[ \t]+/gm, ''); 

        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success("Ficha de resolución copiada al portapapeles");
        } catch (err) {
            console.error("Error al copiar al portapapeles: ", err);
            toast.error("No se pudieron copiar los datos");
        }
    };

    const formatFecha = (fechaStr?: string) => {
        if (!fechaStr || fechaStr.startsWith('0001-01-01')) return 'No registrada';
        const fecha = new Date(fechaStr);
        return new Intl.DateTimeFormat('es-HN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(fecha);
    };

    if (isLoadingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 animate-fadeIn text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1e5f8a]" />
                <p className="text-sm font-medium">Sincronizando ficha técnica de resolución...</p>
            </div>
        );
    }

    if (!resolution) {
        return (
            <div className="p-6 text-center space-y-4 animate-fadeIn">
                <p className="text-gray-500 font-medium">No se encontraron los detalles de la resolución solicitada.</p>
                <button
                    onClick={() => navigate('/dashboard/resolutions')}
                    className="inline-flex items-center gap-2 text-sm text-[#1e5f8a] hover:underline cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver al listado
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">

            {/* Historial superior (Breadcrumbs) */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Soporte</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/resolutions')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Resoluciones</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Detalles</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Resoluciones
                </h1>
            </div>

            {/* ─── TARJETA CONTENEDORA PRINCIPAL ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8 relative">

                {/* Cabecera Interna */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                            <Wrench className="h-6 w-6 text-[#1a558b]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Detalles de Resolucion</h2>
                            <p className="text-sm text-gray-400 mt-0.5">Ficha técnica detallada del registro de soporte</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCopyClipboard}
                            className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer uppercase tracking-wider"
                        >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar Ficha
                        </button>

                        <button
                            onClick={() => navigate(`/dashboard/resolutions/edit/${id}`)}
                            className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer uppercase tracking-wider"
                        >
                            <Edit3 className="h-3.5 w-3.5" />
                            Editar Registro
                        </button>
                    </div>
                </div>

                {/* ─── GRID CON 14 Campos ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

                    {/* Id Resolución */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">ID Resolución</h3>
                        <p className="text-sm text-slate-700 font-mono font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg inline-block select-text">
                            #{resolution.id}
                        </p>
                    </div>

                    {/* Ticket Relacionado */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Ticket Resuelto</h3>
                        <p className="text-sm text-slate-700 font-mono font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg inline-block select-text">
                            #{resolution.idTicket}
                        </p>
                    </div>

                    {/* Usuario TI */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Usuario Especialista TI</h3>
                        <p className="text-sm text-slate-800 font-bold select-text">{resolution.userName || 'N/A'}</p>
                    </div>

                    {/* Dispositivo */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Dispositivo/Equipo</h3>
                        <p className="text-sm text-gray-500 font-medium select-text">{resolution.deviceName || 'No especificado'}</p>
                    </div>

                    {/* Prioridad */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Prioridad Asignada</h3>
                        <p className="text-sm text-gray-500 font-medium">{resolution.priorityName || 'N/A'}</p>
                    </div>

                    {/* Estado de Solución */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Estado de la Solución</h3>
                        <div>
                            <span className={`inline-flex items-center justify-center px-6 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                                resolution.idSolutionStatus === 1 ? 'bg-[#2ecc71]' : 'bg-amber-500'
                            }`}>
                                {resolution.solutionStatusName || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Tiempo Tardado */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Tiempo Invertido (Solución)</h3>
                        <p className="text-sm text-gray-500 font-mono font-medium">{resolution.solutionTime ?? 0} Horas</p>
                    </div>

                    {/* Creador del Ticket */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Usuario Solicitante (Ticket)</h3>
                        <p className="text-sm text-gray-500 font-medium select-text">{resolution.ticketCreatorName || 'N/A'}</p>
                    </div>

                    {/* Área del Ticket */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Área Afectada</h3>
                        <p className="text-sm text-gray-400 font-medium">{resolution.ticketAreaName || 'Mesa de Ayuda General'}</p>
                    </div>

                    {/* Descripción del Ticket */}
                    <div className="space-y-1 md:col-span-2 border-t border-slate-50 pt-3">
                        <h3 className="text-sm font-bold text-slate-600">Descripción Original del Ticket</h3>
                        <p className="text-sm text-slate-600 bg-slate-50/50 border border-slate-100 rounded-xl p-3 leading-relaxed select-text italic">
                            "{resolution.ticketDescription || 'Sin descripción'}"
                        </p>
                    </div>

                    {/* Acción Tomada */}
                    <div className="space-y-1 md:col-span-2">
                        <h3 className="text-sm font-bold text-slate-600">Acción Tomada</h3>
                        <p className="text-sm text-slate-700 bg-neutral-50 border border-neutral-100 rounded-xl p-4 leading-relaxed whitespace-pre-line select-text">
                            {resolution.actionTaken || 'N/A'}
                        </p>
                    </div>

                    {/* Problema Raíz */}
                    <div className="space-y-1 md:col-span-2">
                        <h3 className="text-sm font-bold text-slate-600">Problema Raíz (Causa)</h3>
                        <p className="text-sm text-slate-700 bg-neutral-50 border border-neutral-100 rounded-xl p-4 leading-relaxed whitespace-pre-line select-text">
                            {resolution.rootCause || 'N/A'}
                        </p>
                    </div>

                    {/* Medidas Preventivas */}
                    <div className="space-y-1 md:col-span-2">
                        <h3 className="text-sm font-bold text-slate-600">Medidas Preventivas Sugeridas</h3>
                        <p className="text-sm text-slate-700 bg-neutral-50 border border-neutral-100 rounded-xl p-4 leading-relaxed whitespace-pre-line select-text">
                            {resolution.preventiveMeasures || 'Ninguna registrada.'}
                        </p>
                    </div>

                    {/* Observación */}
                    <div className="space-y-1 md:col-span-2">
                        <h3 className="text-sm font-bold text-slate-600">Observación Primaria</h3>
                        <p className="text-sm text-slate-700 bg-neutral-50 border border-neutral-100 rounded-xl p-4 leading-relaxed whitespace-pre-line select-text">
                            {resolution.observation || 'Ninguna registrada.'}
                        </p>
                    </div>

                    {/* Segunda Observación */}
                    <div className="space-y-1 md:col-span-2">
                        <h3 className="text-sm font-bold text-slate-600">Segunda Observación (Seguimiento)</h3>
                        <p className="text-sm text-slate-700 bg-neutral-50 border border-neutral-100 rounded-xl p-4 leading-relaxed whitespace-pre-line select-text">
                            {resolution.secondObservation || 'Ninguna registrada.'}
                        </p>
                    </div>

                </div>

                {/* ─── PIE DE PÁGINA ─── */}
                <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-6 text-xs font-mono text-gray-400">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-300" />
                        <span>Fecha Resolución: {formatFecha(resolution.resolutionDate)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};