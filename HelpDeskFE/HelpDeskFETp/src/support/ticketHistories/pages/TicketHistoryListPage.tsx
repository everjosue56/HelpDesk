import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    RefreshCw,
    Calendar,
    Search,
    User,
    X,
    Wrench,
    Eye,
    Tag,
    FileText
} from 'lucide-react';
import { Button } from '../../../../@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '../../../../@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../@/components/ui/select';
import { useTicketHistories } from '../hook/useTicketHistories';
import { useUsers } from '../../../administrative/users/hooks/useUser';

export const TicketHistoryListPage: React.FC = () => {
    const navigate = useNavigate();

    // ─── ESTADOS DE PAGINACIÓN Y FILTROS ───
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<number | undefined>(undefined);
    const [selectedResolution, setSelectedResolution] = useState<number | undefined>(undefined);
    const [selectedUser, setSelectedUser] = useState<number | undefined>(undefined);
    const [dateFrom, setDateFrom] = useState<string>('');

    const memoizedFilters = React.useMemo(() => ({
        idTicket: selectedTicket,
        idResolution: selectedResolution,
        idUser: selectedUser,
        dateFrom: dateFrom || null,
        dateTo: null
    }), [selectedTicket, selectedResolution, selectedUser, dateFrom]);

    const { histories, totalCount, isLoading, refreshHistories } = useTicketHistories(page, pageSize, memoizedFilters);

    // Catálogos auxiliares
    const { users } = useUsers('', null, null, null, null, 1, 100);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

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

    const formatFecha = (fechaStr?: string) => {
        if (!fechaStr) return 'N/A';
        return new Date(fechaStr).toLocaleDateString('es-HN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const filteredHistories = histories.filter(h => {
        if (!searchKeyword) return true;
        const term = searchKeyword.toLowerCase();
        return (
            h.ticketDescription?.toLowerCase().includes(term) ||
            h.actionTaken?.toLowerCase().includes(term) ||
            h.rootCause?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">

            {/* ─── HISTORIAL SUPERIOR (BREADCRUMBS) ─── */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Soporte</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Historial de Tickets</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Historial de Tickets
                </h1>
            </div>

            {/* ─── CONTENEDOR DE KPIS ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Resueltos</p>
                        <p className="text-3xl font-bold text-slate-800">
                            {totalCount ?? 0}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <Wrench className="h-6 w-6 text-[#1a558b]" />
                    </div>
                </div>
            </div>

            {/* ─── CONTENEDOR PRINCIPAL DEL LISTADO ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Listado de Tickets Resueltos</h2>
                        <p className="text-xs text-gray-400">Gestiona todos los tickets registrados e historiales consolidados en el sistema</p>
                    </div>
                    <Button
                        onClick={refreshHistories}
                        disabled={isLoading}
                        variant="outline"
                        className="rounded-xl h-11 gap-2 border-gray-200 text-slate-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Sincronizando...' : 'Actualizar'}
                    </Button>
                </div>

                {/* ─── BARRA DE FILTROS ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full pt-2">

                    {/* 1. Buscador Global */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por descrip..."
                            value={searchKeyword}
                            onChange={(e) => { setSearchKeyword(e.target.value); setPage(1); }}
                            className="w-full h-9.5 pl-9 pr-9 bg-white border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                        />
                        {searchKeyword && (
                            <button onClick={() => { setSearchKeyword(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 2. Filtrar por Número de Ticket */}
                    <div className="flex items-center gap-2 w-full">
                        <input
                            type="number"
                            placeholder="Filtrar por Ticket"
                            value={selectedTicket || ''}
                            onChange={(e) => { setSelectedTicket(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
                            className="w-full h-9.5 pl-3 pr-2 bg-white border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                        />
                        {selectedTicket && (
                            <button onClick={() => { setSelectedTicket(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 3. Filtrar por Número de Resolución */}
                    <div className="flex items-center gap-2 w-full">
                        <input
                            type="number"
                            placeholder="Filtrar por Resol."
                            value={selectedResolution || ''}
                            onChange={(e) => { setSelectedResolution(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
                            className="w-full h-9.5 pl-3 pr-2 bg-white border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                        />
                        {selectedResolution && (
                            <button onClick={() => { setSelectedResolution(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 4. Filtrar por Usuario */}
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

                    {/* 5. Filtrar por Fecha */}
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative w-full">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                                className="w-full h-9.5 pl-3 pr-2 bg-white border border-gray-200 rounded-xl text-xs text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                            />
                        </div>
                        {dateFrom && (
                            <button onClick={() => { setDateFrom(''); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ─── TABLA DE DATOS  ─── */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-[13px]">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-800 font-bold border-b border-gray-200">
                                <th className="p-3.5 w-16 pl-5">No.</th>
                                <th className="p-3.5">Usuario/Tecnico</th>
                                <th className="p-3.5">Ticket</th>
                                <th className="p-3.5">Resolución</th>
                                <th className="p-3.5">Fecha Cierre</th>
                                <th className="p-3.5 w-20 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-slate-900 font-medium">
                            {isLoading && filteredHistories.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-800 font-bold animate-pulse bg-slate-50/50">
                                        Sincronizando reportes de soporte técnico con el servidor central...
                                    </td>
                                </tr>
                            ) : filteredHistories.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-bold bg-slate-50/30">
                                        No se encontraron registros en la bitácora de tickets.
                                    </td>
                                </tr>
                            ) : (
                                filteredHistories.map((row, index) => {
                                    const itemNumber = (page - 1) * pageSize + index + 1;
                                    return (
                                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors border-b border-gray-100">
                                            <td className="p-3.5 pl-5 font-mono text-slate-500 text-xs font-bold">{itemNumber}</td>
                                            <td className="p-3.5 text-slate-700 font-medium flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400" /> {row.userName}
                                            </td>
                                            <td className="p-3">
                                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[12px] font-bold bg-blue-50 text-blue-700 ">
                                                    <Tag className="h-2.5 w-2.5 mr-1 text-blue-400" /> #{row.idTicket}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[12px] font-bold bg-purple-50 text-purple-700">
                                                    <FileText className="h-2.5 w-2.5 mr-1 text-purple-400" /> #{row.idResolution}
                                                </span>
                                            </td>
                                            <td className="p-3.5 text-slate-500 font-medium whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                                    {formatFecha(row.closeDate)}
                                                </div>
                                            </td>
                                            <td className="p-3.5 text-center">
                                                <button
                                                    onClick={() => navigate(`details/${row.id}`)}
                                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#1a558b] cursor-pointer transition-colors inline-block bg-transparent border-none"
                                                    title="Ver Ficha Técnica"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ─── PAGINACIÓN ─── */}
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
        </div>
    );
};