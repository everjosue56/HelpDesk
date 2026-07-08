import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { Copy, Edit3, ArrowLeft, Loader2, Tag, Calendar, Settings } from 'lucide-react';
import { toast } from 'sonner';

export const DetailsTicketPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const ticketId = Number(id);

    const [isLoadingData, setIsLoadingData] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [ticket, setTicket] = useState<any | null>(null);

    // Consumimos las acciones del hook de tickets
    const { getTicketById } = useTickets('', 1, 1);

    useEffect(() => {
        let isMounted = true;
        const fetchTicket = async () => {
            if (!ticketId) return;
            try {
                setIsLoadingData(true);
                const res = await getTicketById(ticketId);
                
                if (isMounted && res) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const resAny = res as any;
                    const ticketData = resAny?.data || resAny?.Data || resAny;
                    setTicket(ticketData);
                }
            } catch (error) {
                console.error("Error cargando ticket por ID:", error);
                toast.error("No se pudo recuperar la información del ticket.");
            } finally {
                if (isMounted) setIsLoadingData(false);
            }
        };

        fetchTicket();
        return () => { isMounted = false; };
    }, [ticketId, getTicketById]);

    // Copiar Ficha técnica
    const handleCopyClipboard = async () => {
        if (!ticket) return;

        const textToCopy = `
            Ticket No: #${ticket.id}
            Descripción: ${ticket.description}
            Usuario Asignado: ${ticket.userName || 'No asignado'}
            Área Solicitante: ${ticket.areaName || 'No asignada'}
            Tipo de Error: ${ticket.typeErrorName || 'No tipificado'}
            Sistema Afectado: ${ticket.softwareSystemName || 'No especificado'}
            Prioridad: ${ticket.priorityName || 'Media'}
            Impacto: ${ticket.impactName || 'Bajo'}
            Estado: ${ticket.isActive ? 'Abierto / Activo' : 'Cerrado / Resuelto'}
        `.trim().replace(/^[ \t]+/gm, '');

        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success("Ficha de incidencia copiada al portapapeles");
        } catch (err) {
            console.error("Error al copiar al portapapeles: ", err);
        }
    };

    const formatFecha = (fechaStr?: string) => {
        if (!fechaStr || fechaStr.startsWith('0001-01-01')) return 'No registrada';
        const fecha = new Date(fechaStr);
        return new Intl.DateTimeFormat('es-HN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(fecha);
    };

    // Renderizado dinámico para las etiquetas de Impacto
    const renderImpactBadge = (impactName: string, impactId: number) => {
        const label = impactName || 'Bajo - Individual';
        switch (impactId) {
            case 1:
                return <span className="inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/60 shadow-sm">{label}</span>;
            case 2:
                return <span className="inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 shadow-sm">{label}</span>;
            case 3:
                return <span className="inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 shadow-sm">{label}</span>;
            case 4:
                return <span className="inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold text-red-700 bg-red-50 border border-red-100 shadow-sm animate-pulse">{label}</span>;
            default:
                return <span className="inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 shadow-sm">{label}</span>;
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 animate-fadeIn text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1e5f8a]" />
                <p className="text-sm font-medium">Sincronizando ficha técnica del ticket...</p>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="p-6 text-center space-y-4 animate-fadeIn">
                <p className="text-gray-500 font-medium">No se encontraron los detalles del ticket solicitado.</p>
                <button
                    onClick={() => navigate('/dashboard/tickets')} 
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
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Soporte</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Tickets</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Detalles</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Tickets
                </h1>
            </div>

            {/* ─── TARJETA CONTENEDORA PRINCIPAL ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8 relative">

                {/* Cabecera Interna: Títulos y Botones de Acción */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700 hidden sm:block">
                            <Tag className="h-6 w-6 text-[#1a558b]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Ficha del Ticket</h2>
                            <p className="text-sm text-gray-400 mt-0.5">Auditoría operativa y canalización de soporte</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate('/dashboard/resolutions/create')}
                            className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer uppercase tracking-wider"
                        >
                            <Settings className="h-3.5 w-3.5" />
                            Resolver Ticket 
                        </button>
                        <button
                            onClick={handleCopyClipboard}
                            className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer uppercase tracking-wider"
                        >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar Ficha
                        </button>

                        <button
                            onClick={() => navigate(`/dashboard/tickets/edit/${ticket.id}`)}
                            className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer uppercase tracking-wider"
                        >
                            <Edit3 className="h-3.5 w-3.5" />
                            Editar Registro
                        </button>
                    </div>
                </div>

                {/* ─── GRID DE INFORMACIÓN INTEGRAL ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

                    {/* Código Identificador */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Número de Ticket/Id</h3>
                        <p className="text-sm text-slate-700 font-mono font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg inline-block select-text">
                            #{ticket.id}
                        </p>
                    </div>

                    {/* Usuario Responsable */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Usuario Asignado</h3>
                        <p className="text-sm text-slate-800 font-bold select-text">{ticket.userName || 'Sin usuario asignado'}</p>
                    </div>

                    {/* Área Operativa */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Área Solicitante</h3>
                        <p className="text-sm text-gray-500 font-medium">{ticket.areaName || 'Área no registrada'}</p>
                    </div>

                    {/* Tipo de Error */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Clasificación del Error</h3>
                        <p className="text-sm text-gray-500 font-medium">{ticket.typeErrorName || 'No tipificado'}</p>
                    </div>

                    {/* Sistema Afectado */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Sistema / Software Afectado</h3>
                        <p className="text-sm text-gray-500 font-medium select-text">{ticket.softwareSystemName || 'Ninguno (Falla general)'}</p>
                    </div>

                    {/* Prioridad */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Nivel de Prioridad</h3>
                        <p className="text-sm text-gray-500 font-medium">{ticket.priorityName || 'Media'}</p>
                    </div>

                    {/* Impacto */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-600">Grado de Impacto</h3>
                        <div>
                            {renderImpactBadge(ticket.impactName, ticket.idImpact)}
                        </div>
                    </div>

                    {/* Estado del ticket */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-600">Estado del Ticket</h3>
                        <div>
                            <span className={`inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold min-w-32 text-white shadow-sm ${
                                ticket.isActive ? 'bg-[#2ecc71]' : 'bg-[#e74c3c]'
                            }`}>
                                {ticket.isActive ? 'Abierto / Activo' : 'Cerrado / Resuelto'}
                            </span>
                        </div>
                    </div>

                    {/* Descripción Ampliada */}
                    <div className="space-y-1 md:col-span-2 border-t border-slate-50 pt-4">
                        <h3 className="text-sm font-bold text-slate-600">Detalle de la Incidencia</h3>
                        <p className="text-sm text-slate-600 bg-neutral-50 border border-neutral-100 rounded-xl p-4 leading-relaxed whitespace-pre-line select-text">
                            {ticket.description || 'Sin descripción detallada disponible.'}
                        </p>
                    </div>

                </div>

                {/* ─── PIE DE PÁGINA DE LA TARJETA ─── */}
                <div className="pt-6 border-t border-gray-100 flex items-center gap-4 text-xs font-mono text-gray-400">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-300" />
                        <span>Reportado el: {formatFecha(ticket.reportDate)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};