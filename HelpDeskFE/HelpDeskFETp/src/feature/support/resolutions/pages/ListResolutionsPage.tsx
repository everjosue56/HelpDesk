import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResolutions } from '../hooks/useResolutions';
import { useUsers } from '../../../administrative/users/hooks/useUser';
import { useTickets } from '../../tickets/hooks/useTickets';
import {
    Plus,
    Search,
    Eye,
    Trash2,
    Edit,
    X,
    CheckCircle,
    Wrench,
    Calendar,
    FileSpreadsheet
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../../../@/components/ui/pagination';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../@/components/ui/select';
import { ResolutionDeleteModal } from '../components/ResolutionDeleteModal';
import { useDevices } from '../../../inventory/devices/hooks/useDevices';
import { useSupportCatalogs } from '../../tickets/hooks/useSupportCatalogs';

export const ListResolutionPage: React.FC = () => {
    // ─── ESTADOS DE FILTROS INTERACTIVOS ───
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<number | undefined>(undefined);
    const [selectedTicket, setSelectedTicket] = useState<number | undefined>(undefined);
    const [selectedDevice, setSelectedDevice] = useState<number | undefined>(undefined);
    const [selectedPriority, setSelectedPriority] = useState<number | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<string>('');

    // ─── ESTADOS CONTROLADOS PARA EL MODAL DE DESACTIVACIÓN ───
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [resolutionToDelete, setResolutionToDelete] = useState<{ id: number; description: string } | null>(null);

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const memoizedFilters = React.useMemo(() => ({
        idTicket: selectedTicket,
        idUser: selectedUser,
        idSolutionStatus: null,
        idDevice: selectedDevice,
        idPriority: selectedPriority,
        dateFrom: selectedDate || null,
        dateTo: null
    }), [selectedTicket, selectedUser, selectedDevice, selectedPriority, selectedDate]);

    const {
        resolutions,
        totalCount,
        isLoading,
        resolvedTodayCount,
        deleteResolution,
        downloadExcel,
    } = useResolutions(searchTerm, page, pageSize, memoizedFilters);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const navigate = useNavigate();
    const [isExportingExcel, setIsExportingExcel] = useState(false);

    // ─── CONSUMO DE ENDPOINTS RELACIONALES PARA LOS COMBOS ───
    const { users } = useUsers('', null, null, null, null, 1, 100);
    const { tickets } = useTickets('', 1, 100);
    const { devices } = useDevices('', 1, 100);
    const { priorities } = useSupportCatalogs();

    const openDeleteConfirm = (id: number, actionTaken: string) => {
        setResolutionToDelete({ id, description: actionTaken });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async (id: number) => {
        try {
            await deleteResolution(id);
            toast.success("Resolución dada de baja correctamente");
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar la baja de la resolución");
        }
    };

    // ─── CONTROLADORES DE PAGINACIÓN ───
    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        if (page > 1) setPage(page - 1);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (page < totalPages) setPage(page + 1);
    };

    const handlePageClick = (e: React.MouseEvent, pageNumber: number) => {
        e.preventDefault();
        setPage(pageNumber);
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

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">

            {/* Historial superior */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Soporte</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Resoluciones</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Resoluciones
                </h1>
            </div>

            {/* CONTENEDOR DE KPIS  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Tickets Resueltos Hoy</p>
                        <p className="text-3xl font-bold text-slate-800">{resolvedTodayCount ?? 0}</p>
                    </div>
                    <div className="p-3 bg-[#1a558b] text-white rounded-xl">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Resoluciones</p>
                        <p className="text-3xl font-bold text-slate-800">{totalCount ?? 0}</p>
                    </div>
                    <div className="p-3 bg-[#eef2f5] border border-gray-100 text-slate-600 rounded-xl">
                        <Wrench className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL DEL LISTADO */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Lista de Resoluciones</h2>
                        <p className="text-xs text-gray-400">Gestiona todas las soluciones registradas en el sistema</p>
                    </div>
                         <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleExportExcel}
                        disabled={isExportingExcel}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-sm h-10 px-4 cursor-pointer transition-colors text-sm disabled:opacity-50 border-none"
                    >
                        <  FileSpreadsheet className="w-4 h-4" />
                        {isExportingExcel ? 'Exportando...' : 'Exportar Excel'}
                    </button>
                    <button
                        className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        onClick={() => navigate("create")}
                    >
                        <Plus className="h-4 w-4" />
                        Nueva Resolución
                    </button>
                </div>
                </div>

                {/* ─── BARRA DE FILTROS ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 w-full pt-2">

                    {/* 1. Buscador global */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por observacion..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full h-9.5 pl-9 pr-9 bg-white border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a558b]/20 focus:border-[#1a558b] transition-all"
                        />
                        {searchTerm && (
                            <button onClick={() => { setSearchTerm(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 2. Filtrar por Usuario */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setSelectedUser(Number(val)); setPage(1); }} value={selectedUser ? String(selectedUser) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-xs text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por Usuario" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-xs">
                                {users?.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)} className="cursor-pointer">{u.userName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedUser && (
                            <button onClick={() => { setSelectedUser(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 3. Filtrar por Ticket */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setSelectedTicket(Number(val)); setPage(1); }} value={selectedTicket ? String(selectedTicket) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-xs text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por Ticket" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-xs">
                                {tickets?.map((t) => (
                                    <SelectItem key={t.id} value={String(t.id)} className="cursor-pointer">#{t.id}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedTicket && (
                            <button onClick={() => { setSelectedTicket(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 4. Filtrar por Dispositivo */}
                    <div className="flex items-center gap-2 w-full">
                        <Select
                            onValueChange={(val) => { setSelectedDevice(Number(val)); setPage(1); }}
                            value={selectedDevice ? String(selectedDevice) : ""}
                        >
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-xs text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por dispositivo" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-xs">
                                {devices?.map((d) => (
                                    <SelectItem key={d.id} value={String(d.id)} className="cursor-pointer">
                                        {d.brandName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedDevice && (
                            <button onClick={() => { setSelectedDevice(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 5. Filtrar por Prioridad */}
                    <div className="flex items-center gap-2 w-full">
                        <Select
                            onValueChange={(val) => { setSelectedPriority(Number(val)); setPage(1); }}
                            value={selectedPriority ? String(selectedPriority) : ""}
                        >
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-xs text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por prioridad" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-xs">
                                {priorities?.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)} className="cursor-pointer">
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedPriority && (
                            <button onClick={() => { setSelectedPriority(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 6. Filtrar por Fecha */}
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative w-full">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }}
                                className="w-full h-9.5 pl-3 pr-2 bg-white border border-gray-200 rounded-xl text-xs text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1a558b]/20 focus:border-[#1a558b] transition-all"
                            />
                        </div>
                        {selectedDate && (
                            <button onClick={() => { setSelectedDate(''); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                </div>

                {/* TABLA DE DATOS SÓLIDA - ALTO CONTRASTE */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-[13px]">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-800 font-bold border-b border-gray-200">
                                <th className="p-3.5 w-16 pl-5">No.</th>
                                <th className="p-3.5">Usuario</th>
                                <th className="p-3.5">Ticket</th>
                                <th className="p-3.5">Dispositivo</th>
                                <th className="p-3.5">Prioridad</th>
                                <th className="p-3.5">Fecha</th>
                                <th className="p-3.5 w-28 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-slate-900 font-medium">
                            {isLoading && resolutions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-800 font-bold animate-pulse bg-slate-50/50">
                                        Sincronizando registros de resoluciones con el servidor central...
                                    </td>
                                </tr>
                            ) : resolutions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500 font-bold bg-slate-50/30">
                                        No se encontraron registros de resoluciones con los criterios especificados.
                                    </td>
                                </tr>
                            ) : (
                                resolutions.map((item, index) => {
                                    const itemNumber = (page - 1) * pageSize + index + 1;
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors border-b border-gray-100">
                                            <td className="p-3.5 pl-5 font-mono text-slate-500 text-xs font-bold">
                                                {itemNumber}
                                            </td>
                                            <td className="p-3.5 text-slate-900 font-medium">{item.userName || 'N/A'}</td>
                                            <td className="p-3 text-slate-500 ">#{item.idTicket}</td>
                                            <td className="p-3.5 text-slate-500 truncate max-w-50">{item.deviceName || 'N/A'}</td>
                                            <td className="p-3.5">
                                                <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-bold ${item.priorityName === 'Urgente' ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse' :
                                                        item.priorityName === 'Alto' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                            item.priorityName === 'Medio' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                                'bg-slate-50 text-slate-700 border border-slate-200/60'
                                                    }`}>
                                                    {item.priorityName || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="p-3.5 text-slate-500 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                                    {item.resolutionDate ? new Date(item.resolutionDate).toLocaleDateString('es-HN') : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="p-3.5">
                                                <div className="flex items-center justify-center gap-3 text-slate-400">
                                                    <button type="button" className="hover:text-[#1a558b] transition-colors cursor-pointer  hover:bg-slate-100 rounded-md" onClick={() => navigate(`details/${item.id}`)} title="Ver detalle"><Eye className="h-4 w-4" /></button>
                                                    <button type="button" className="hover:text-red-600 transition-colors cursor-pointer hover:bg-red-50 rounded-md" onClick={() => openDeleteConfirm(item.id!, item.actionTaken || '')} title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                                                    <button type="button" className="hover:text-[#1e5f8a] transition-colors cursor-pointer hover:bg-blue-50 rounded-md" onClick={() => navigate(`edit/${item.id}`)} title="Editar"><Edit className="h-4 w-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN */}
                {totalPages > 1 && (
                    <div className="pt-4 flex justify-center select-none">
                        <Pagination>
                            <PaginationContent className="text-xs font-bold text-neutral-500 gap-1">

                                {/* Botón Anterior */}
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={handlePrevious}
                                        className={`rounded-lg h-8 px-2.5 text-xs font-bold transition-colors cursor-pointer ${page === 1
                                            ? "pointer-events-none opacity-40 select-none"
                                            : "hover:bg-slate-50 text-neutral-600"
                                            }`}
                                    />
                                </PaginationItem>

                                {/* LÓGICA DE FILTRADO DE PÁGINAS VISIBLES */}
                                {(() => {
                                    const pages: (number | string)[] = [];

                                    if (totalPages <= 5) {
                                        // Si son poquitas páginas, las metemos todas directas
                                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                                    } else {
                                        // Siempre metemos la página 1 y 2
                                        pages.push(1);
                                        pages.push(2);

                                        // Si la página actual está más adelante, metemos los puntos suspensivos
                                        if (page > 4) {
                                            pages.push("...");
                                        }

                                        // Renderizamos las páginas cercanas a la actual
                                        for (let i = Math.max(3, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                                            if (!pages.includes(i)) {
                                                pages.push(i);
                                            }
                                        }

                                        // Si falta mucho para llegar al final, otra elipsis
                                        if (page < totalPages - 2) {
                                            if (!pages.includes("...")) {
                                                pages.push("...");
                                            }
                                        }

                                        // Siempre cerramos con la última página fija al final
                                        if (!pages.includes(totalPages)) {
                                            pages.push(totalPages);
                                        }
                                    }

                                    return pages.map((pageItem, index) => {
                                        // Si es una elipsis, pintamos texto estático plano
                                        if (pageItem === "...") {
                                            return (
                                                <PaginationItem key={`ellipsis-${index}`}>
                                                    <span className="w-8 h-8 flex items-center justify-center text-xs text-neutral-400 font-medium select-none">
                                                        ...
                                                    </span>
                                                </PaginationItem>
                                            );
                                        }

                                        // Si es un número, pintamos el botón interactivo normal
                                        const pageNum = pageItem as number;
                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => handlePageClick(e, pageNum)}
                                                    isActive={page === pageNum}
                                                    className={`rounded-lg w-8 h-8 text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${page === pageNum
                                                        ? "bg-[#1a558b] text-white hover:bg-[#1a558b] hover:text-white"
                                                        : "hover:bg-slate-50 text-neutral-600"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    });
                                })()}

                                {/* Botón Siguiente */}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={handleNext}
                                        className={`rounded-lg h-8 px-2.5 text-xs font-bold transition-colors cursor-pointer ${page === totalPages
                                            ? "pointer-events-none opacity-40 select-none"
                                            : "hover:bg-slate-50 text-neutral-600"
                                            }`}
                                    />
                                </PaginationItem>

                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

            </div>

            {/* MODAL DE DESACTIVACIÓN */}
            <ResolutionDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setResolutionToDelete(null); }}
                onConfirm={handleConfirmDelete}
                resolution={resolutionToDelete}
            />
        </div>
    );
};