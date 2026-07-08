import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldAlert,
    RefreshCw,
    Calendar,
    Search,
    User,
    X,
    Database
} from 'lucide-react';
import { Input } from '../../../../@/components/ui/input';
import { Button } from '../../../../@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '../../../../@/components/ui/pagination';
import { useAudit } from '../hooks/useAudit';

export const AuditLogsPage: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { logs, totalCount, isLoading, refresh } = useAudit(search, page, pageSize);

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

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

            {/* ─── HISTORIAL SUPERIOR (BREADCRUMBS) ─── */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                    >
                        Inicio
                    </span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span
                        onClick={() => navigate('/dashboard/organizations')}
                        className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                    >
                        Administrativo
                    </span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Auditoría</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Bitácora de Auditoría
                </h1>
            </div>

            {/* ─── CONTENEDOR DE KPIS  ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Acciones Registradas</p>
                        <p className="text-3xl font-bold text-slate-800">
                            {totalCount ?? 0}
                        </p>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                        <ShieldAlert className="h-6 w-6 text-[#1a558b]" />
                    </div>
                </div>
            </div>

            {/* ─── CONTENEDOR PRINCIPAL DEL LISTADO ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                {/* Cabecera interna y botón de Sincronizar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Registros del Sistema</h2>
                        <p className="text-xs text-gray-400">Historial de acciones críticas y control de accesos de Financiera Codimersa</p>
                    </div>
                    <Button
                        onClick={refresh}
                        disabled={isLoading}
                        variant="outline"
                        className="rounded-xl h-11 gap-2 border-gray-200 text-slate-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Sincronizando...' : 'Actualizar'}
                    </Button>
                </div>

                {/* Filtro interactivo de Búsqueda */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar por usuario o acción..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ─── TABLA DE DATOS  ─── */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 font-semibold border-b border-gray-200">
                                <th className="p-3 w-16">No.</th>
                                <th className="p-3">Usuario</th>
                                <th className="p-3 w-28">Acción</th>
                                <th className="p-3">Tabla / Módulo</th>
                                <th className="p-3">Descripción</th>
                                <th className="p-3 w-48">Fecha y Hora</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-gray-100 text-slate-700 transition-opacity duration-200 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
                            }`}>
                            {isLoading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400 animate-pulse">
                                        Consultando bitácora al servidor central...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        No se encontraron registros de auditoría.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log, index) => {
                                    const itemNumber = (page - 1) * pageSize + index + 1;
                                    return (
                                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3 font-mono text-gray-400 text-xs font-semibold">
                                                {itemNumber}
                                            </td>
                                            <td className="p-3 font-semibold text-slate-800 flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400" /> {log.userName}
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold ${log.action === 'CREATE' ? 'bg-green-50 text-green-700' :
                                                        log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="p-3 font-mono text-xs text-[#1a558b]">
                                                <span className="flex items-center gap-1">
                                                    <Database className="h-3 w-3 text-slate-400" />
                                                    {log.tableName}
                                                </span>
                                            </td>
                                            <td className="p-3 text-slate-600">{log.description}</td>
                                            <td className="p-3 text-gray-500 flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                {log.createdAt && log.createdAt !== 'N/A'
                                                    ? new Date(log.createdAt.endsWith('Z') ? log.createdAt : `${log.createdAt}Z`).toLocaleString()
                                                    : 'Reciente'
                                                }
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