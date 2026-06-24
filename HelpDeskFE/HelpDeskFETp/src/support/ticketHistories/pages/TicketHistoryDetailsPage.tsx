import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, RefreshCw } from 'lucide-react';
import { Button } from '../../../../@/components/ui/button';
import { toast } from 'sonner';
import { AXIOS_INSTANCE } from '../../../api/axios-instance';
import { getTicketHistory } from '../../../api/generated/ticket-history/ticket-history';
import type { TicketHistoryDto } from '../hook/useTicketHistories';

export const TicketHistoryDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [record, setRecord] = useState<TicketHistoryDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const service = useMemo(() => getTicketHistory(AXIOS_INSTANCE), []);

    const formatFecha = (fechaStr?: string) => {
        if (!fechaStr) return 'N/A';
        return new Date(fechaStr).toLocaleDateString('es-HN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    useEffect(() => {
        let isMounted = true;

        const loadDetails = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const response = await service.getApiTicketHistoriesId(Number(id));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const backendResponse = response.data as any;
                
                if (isMounted) {
                    const data = backendResponse?.data || backendResponse?.Data || backendResponse;
                    setRecord(data);
                }
            } catch (error) {
                console.error("Error al recuperar los detalles del historial:", error);
                toast.error("No se pudo sincronizar la ficha técnica con el servidor");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadDetails();

        return () => {
            isMounted = false;
        };
    }, [id, service]);

    // Lógica del botón "Copiar Datos" 
    const handleCopyData = () => {
        if (!record) return;
        const textToCopy = `
            Ficha de Historial Técnico #${record.id}
            ---------------------------------------
            Número de Ticket: ${String(record.idTicket).padStart(3, '0')}
            Sistema Afectado: ${record.softwareSystemName}
            Descripción: ${record.ticketDescription}
            Número de Resolución: ${String(record.idResolution).padStart(3, '0')}
            Acción Tomada: ${record.actionTaken}
            Causa Raíz: ${record.rootCause}
            Tiempo Tardado: ${record.solutionTime} H
            Técnico Asignado: ${record.userName}
        `.replace(/^[ \t]+/mg, '');

        navigator.clipboard.writeText(textToCopy);
        toast.success("Estructura de auditoría copiada al portapapeles");
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-[#f8f9fa] min-h-screen font-sans flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-bold text-slate-700 animate-pulse shadow-sm max-w-md w-full">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-3 text-[#1a558b]" />
                    Sincronizando ficha técnica con la base de datos...
                </div>
            </div>
        );
    }

    if (!record) {
        return (
            <div className="p-6 bg-[#f8f9fa] min-h-screen font-sans flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm font-bold text-slate-500 max-w-md w-full space-y-4">
                    <p>No se localizó el registro histórico solicitado.</p>
                    <Button onClick={() => navigate('/dashboard/ticket-histories')} className="rounded-xl bg-[#1a558b] text-white">
                        Volver al listado
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans text-left select-none">
            
            {/* ─── HISTORIAL SUPERIOR (BREADCRUMBS) ─── */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Soporte</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickethistories')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Historial de Tickets</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-gray-400 font-semibold">Detalles</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <h1 className="text-2xl font-black text-neutral-800 tracking-tight">Historial</h1>
                </div>
            </div>

            {/* ─── CONTENEDOR DE LA FICHA TÉCNICA  ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 relative space-y-6 max-w-5xl">
                
                {/* Cabecera interna con el Botón Copiar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
                    <div className="space-y-0.5">
                        <h2 className="text-lg font-bold text-slate-800">Detalles de Ticket</h2>
                        <p className="text-xs text-gray-400">Detalles del ticket seleccionado</p>
                    </div>
                    <Button
                        onClick={handleCopyData}
                        className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-semibold text-xs px-4 h-10 rounded-xl transition-colors shadow-none cursor-pointer border-none"
                    >
                        <Copy className="h-3.5 w-3.5" />
                        Copiar Datos
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-2">
                    
                    {/* Bloque Izquierdo */}
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-extrabold text-slate-800 tracking-tight">Numero de Ticket</label>
                            <p className="text-sm font-medium text-slate-600 font-mono">
                                {record.id}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-extrabold text-slate-800 tracking-tight">Descripcion de Ticket</label>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed select-text">
                                {record.ticketDescription || 'Sin descripción original registrada.'}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-extrabold text-slate-800 tracking-tight">Fecha de Cierre</label>
                            <p className="text-sm font-medium text-slate-600 font-mono">
                                {record.closeDate ? record.closeDate.replace('T', ' ') : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Bloque Derecho */}
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-extrabold text-slate-800 tracking-tight">Nombre de Sistema Afectado</label>
                            <p className="text-sm font-medium text-slate-600">
                                {record.softwareSystemName}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-extrabold text-slate-800 tracking-tight">Numero de Resolucion</label>
                            <p className="text-sm font-medium text-slate-600 font-mono">
                                {record.idResolution}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-extrabold text-slate-800 tracking-tight">Accion Tomada</label>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed select-text">
                                {record.actionTaken}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-extrabold text-slate-800 tracking-tight">Tiempo Tardado</label>
                            <p className="text-sm font-bold text-slate-700">
                                {record.solutionTime} H
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-extrabold text-slate-800 tracking-tight">Usuario</label>
                            <p className="text-sm font-semibold text-slate-600">
                                {record.userName}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-gray-100 text-[11px] font-bold text-slate-400/80 font-mono tracking-wide">
                    Id:{record.id} Creado: {formatFecha(record.createdDate)}
                </div>

            </div>
        </div>
    );
};