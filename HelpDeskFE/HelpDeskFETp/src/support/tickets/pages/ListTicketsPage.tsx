import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { useUsers } from '../../../administrative/users/hooks/useUser';
import { useAreas } from '../../../administrative/areas/hooks/useAreas';
import { useSupportCatalogs } from '../hooks/useSupportCatalogs'; 
import { useTypeErrors } from '../../typeError/hooks/useTypeErrors';
import {
    Plus,
    Search,
    Eye,
    Trash2,
    Edit,
    X,
    CheckCircle,
    Tag,
    Calendar
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../../@/components/ui/pagination';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../@/components/ui/select';
import { TicketDeleteModal } from '../components/TicketDeleteModal';

export const ListTicketsPage: React.FC = () => {
    // ─── ESTADOS DE FILTROS INTERACTIVOS ───
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<number | undefined>(undefined);
    const [selectedArea, setSelectedArea] = useState<number | undefined>(undefined);
    const [selectedTypeError, setSelectedTypeError] = useState<number | undefined>(undefined);
    const [selectedImpact, setSelectedImpact] = useState<number | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<string>('');

    // ─── ESTADOS CONTROLADOS PARA EL MODAL DE DESACTIVACIÓN ───
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState<{ id: number; description: string } | null>(null);

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const {
        tickets,
        totalCount,
      //  activeTicketsCount,
        resolvedTodayCount,
        isLoading,
        deleteTicket
    } = useTickets(searchTerm, page, pageSize, {
        idTypeError: selectedTypeError,
        idArea: selectedArea,
        idImpact: selectedImpact,
        idUser: selectedUser,
        dateFrom: selectedDate || null
    });

    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const navigate = useNavigate();

    // ─── CONSUMO DE ENDPOINTS RELACIONALES PARA LOS COMBOS ───
    const { users } = useUsers('', null, null, null, null, 1, 100);
    const { areas } = useAreas('', '', 1, 100);
    const { typeErrors, isLoading: isLoadingTypes } = useTypeErrors('', 1, 100);
    const { impacts, isLoadingCatalogs } = useSupportCatalogs();

    // Lógica de renderizado de colores para impacto 
    const renderImpactBadge = (impactName: string, impactId: number) => {
        const label = impactName || 'Bajo - Individual';

        switch (impactId) {
            case 1:
                return (
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200/60">
                        {label}
                    </span>
                );
            case 2:
                return (
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-sky-50 text-sky-700 border border-sky-100">
                        {label}
                    </span>
                );
            case 3:
                return (
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        {label}
                    </span>
                );
            case 4:
                return (
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-100 animate-pulse">
                        {label}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-50 text-gray-600 border border-gray-100">
                        {label}
                    </span>
                );
        }
    };

    const openDeleteConfirm = (id: number, description: string) => {
        setTicketToDelete({ id, description });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async (id: number) => {
        try {
            await deleteTicket(id);
            toast.success("Ticket dado de baja correctamente");
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar la baja del ticket");
        }
    };

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

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">

            {/* Historial superior (Breadcrumbs) */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="hover:text-[#1a558b] text-neutral-400 font-semibold select-none">Soporte</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Tickets</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Tickets
                </h1>
            </div>

            {/* CONTENEDOR DE KPIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Tickets Resueltos Hoy</p>
                        <p className="text-3xl font-bold text-slate-800">{resolvedTodayCount ?? 0}</p>
                    </div>
                    <div className="p-3 bg-[#1a558b]/10 text-[#1a558b] rounded-xl">
                        <CheckCircle className="h-6 w-6 text-[#1a558b]" />
                    </div>
                </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                        <p className="text-3xl font-bold text-slate-800">{totalCount ?? 0}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                        <Tag className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL DEL LISTADO */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Lista de Tickets</h2>
                        <p className="text-xs text-gray-400">Gestiona todos los reportes e incidencias técnicas en el sistema</p>
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        onClick={() => navigate("create")}
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Ticket
                    </button>
                </div>

                {/* BARRA DE FILTROS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 w-full pt-2">

                    {/* 1. Buscador global */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por descripcion..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full h-9.5 pl-9 pr-9 bg-white border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
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

                    {/* 3. Filtrar por Área */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setSelectedArea(Number(val)); setPage(1); }} value={selectedArea ? String(selectedArea) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-xs text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por Área" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-xs">
                                {areas?.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)} className="cursor-pointer">{a.nameArea}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedArea && (
                            <button onClick={() => { setSelectedArea(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 4. Filtrar por Tipo de Error */}
                    <div className="flex items-center gap-2 w-full">
                        <Select
                            onValueChange={(val) => { setSelectedTypeError(Number(val)); setPage(1); }}
                            value={selectedTypeError ? String(selectedTypeError) : ""}
                            disabled={isLoadingTypes}
                        >
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-xs text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder={isLoadingTypes ? "Cargando..." : "Filtrar por Tipo"} />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-xs">
                                {typeErrors?.map((te) => (
                                    <SelectItem key={te.id} value={String(te.id)} className="cursor-pointer">
                                        {te.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedTypeError && (
                            <button onClick={() => { setSelectedTypeError(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 5. Filtrar por Impacto */}
                    <div className="flex items-center gap-2 w-full">
                        <Select
                            onValueChange={(val) => { setSelectedImpact(Number(val)); setPage(1); }}
                            value={selectedImpact ? String(selectedImpact) : ""}
                            disabled={isLoadingCatalogs}
                        >
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-xs text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder={isLoadingCatalogs ? "Cargando..." : "Filtrar por Impacto"} />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none text-xs">
                                {impacts?.map((imp) => (
                                    <SelectItem key={imp.id} value={String(imp.id)} className="cursor-pointer">{imp.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedImpact && (
                            <button onClick={() => { setSelectedImpact(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
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
                                className="w-full h-9.5 pl-3 pr-2 bg-white border border-gray-200 rounded-xl text-xs text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                            />
                        </div>
                        {selectedDate && (
                            <button onClick={() => { setSelectedDate(''); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                </div>

                {/* TABLA DE DATOS */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-[13px]">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 font-semibold border-b border-gray-200">
                                <th className="p-3.5 w-16 pl-5">No.</th>
                                <th className="p-3.5">Usuario</th>
                                <th className="p-3.5">Área</th>
                                <th className="p-3.5">Tipo de Error</th>
                                <th className="p-3.5">Impacto</th>
                                <th className="p-3.5">Fecha</th>
                                <th className="p-3.5 w-28 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-gray-100 text-slate-700 transition-opacity duration-200 ${
                            isLoading && tickets.length === 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'
                        }`}>
                            {isLoading && tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400 animate-pulse">
                                        Sincronizando reportes de soporte técnico con el servidor central...
                                    </td>
                                </tr>
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400">
                                        No se encontraron registros de tickets con los criterios especificados.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((item, index) => {
                                    const itemNumber = (page - 1) * pageSize + index + 1;
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3.5 pl-5 font-mono text-gray-400 text-xs font-semibold">{itemNumber}</td>
                                            <td className="p-3.5 text-slate-800 font-semibold">{item.userName}</td>
                                            <td className="p-3 text-slate-700 truncate max-w-55">{item.areaName}</td>
                                            <td className="p-3.5 text-slate-700">{item.typeErrorName}</td>
                                            <td className="p-3.5">
                                                {renderImpactBadge(item.impactName, item.idImpact)}
                                            </td>
                                            <td className="p-3.5 text-gray-400 font-medium whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-gray-300" />
                                                    {new Date(item.reportDate).toLocaleDateString('es-HN')}
                                                </div>
                                            </td>
                                            <td className="p-3.5">
                                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                                    <button type="button" className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => navigate(`details/${item.id}`)} title="Ver detalle"><Eye className="h-4 w-4" /></button>
                                                    <button type="button" className="hover:text-red-500 transition-colors cursor-pointer" onClick={() => openDeleteConfirm(item.id, item.description)} title="Eliminar Ticket"><Trash2 className="h-4 w-4" /></button>
                                                    <button type="button" className="hover:text-[#1e5f8a] transition-colors cursor-pointer" onClick={() => navigate(`edit/${item.id}`)} title="Editar"><Edit className="h-4 w-4" /></button>
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
                    <div className="pt-4 flex justify-center">
                        <Pagination>
                            <PaginationContent className="text-xs font-bold text-neutral-500 gap-1">
                                <PaginationItem>
                                    <PaginationPrevious href="#" onClick={handlePrevious} className={`rounded-lg h-8 px-2.5 text-xs font-bold transition-colors cursor-pointer ${page === 1 ? "pointer-events-none opacity-40 select-none" : "hover:bg-slate-50 text-neutral-600"}`} />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink href="#" onClick={(e) => handlePageClick(e, pageNumber)} isActive={page === pageNumber} className={`rounded-lg w-8 h-8 text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${page === pageNumber ? "bg-[#1a558b] text-white hover:bg-[#1a558b]" : "hover:bg-slate-50 text-neutral-600"}`}>{pageNumber}</PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                                <PaginationItem>
                                    <PaginationNext href="#" onClick={handleNext} className={`rounded-lg h-8 px-2.5 text-xs font-bold transition-colors cursor-pointer ${page === totalPages ? "pointer-events-none opacity-40 select-none" : "hover:bg-slate-50 text-neutral-600"}`} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

            </div>

            {/* MODAL DE DESACTIVACIÓN */}
            <TicketDeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setTicketToDelete(null); }}
                onConfirm={handleConfirmDelete}
                ticket={ticketToDelete}
            />
        </div>
    );
};