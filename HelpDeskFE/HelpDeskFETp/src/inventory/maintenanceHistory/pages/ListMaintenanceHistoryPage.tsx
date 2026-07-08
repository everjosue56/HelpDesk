import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMaintenanceHistory } from '../hooks/useMaintenanceHistory';
import { useDevices } from '../../devices/hooks/useDevices';
import { useUsers } from '../../../administrative/users/hooks/useUser';
import { useTypeDevices } from '../../typeDevices/hooks/useTypeDevices';
import { Input } from '../../../../@/components/ui/input';
import { Button } from '../../../../@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../@/components/ui/select';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '../../../../@/components/ui/pagination';
import { Eye, History, Clock, Search, X, RefreshCw, User, Laptop } from 'lucide-react';

export const ListMaintenanceHistoryPage: React.FC = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState<number>(1);
    const [searchDetails, setSearchDetails] = useState<string>('');
    const [filterDevice, setFilterDevice] = useState<number | undefined>(undefined);
    const [filterUser, setFilterUser] = useState<number | undefined>(undefined);
    const [filterTypeDevice, setFilterTypeDevice] = useState<number | undefined>(undefined);

    const pageSize = 5;

    const { devices: deviceCatalog } = useDevices('', 1, 100);
    const { users: userCatalog } = useUsers('', null, null, null, null, 1, 100);
    const { devices: typeDeviceCatalog } = useTypeDevices('', 1, 100);

    const { histories, totalCount, isLoading, refresh } = useMaintenanceHistory(
        null,
        filterDevice ?? null,
        filterUser ?? null,
        filterTypeDevice ?? null,
        page,
        pageSize
    );

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    const totalHoursInverted = useMemo(() => {
        const totalMinutes = histories.reduce((sum, item) => sum + (item.solutionTime || 0), 0);
        return Math.round(totalMinutes / 60) || 2;
    }, [histories]);

    const filteredHistories = useMemo(() => {
        if (!searchDetails) return histories;
        return histories.filter(h =>
            h.maintenanceDetails.toLowerCase().includes(searchDetails.toLowerCase()) ||
            h.deviceCode.toLowerCase().includes(searchDetails.toLowerCase())
        );
    }, [histories, searchDetails]);

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

            {/* ─── HISTORIAL SUPERIOR  ─── */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inventario</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Historial de Mantenimiento</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">Historial de Mantenimiento</h1>
            </div>

            {/* ─── CONTENEDOR DE KPIS ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Historial</p>
                        <p className="text-3xl font-bold text-slate-800">{totalCount ?? 0}</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <History className="h-6 w-6 text-[#1a558b]" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Horas Invertidas</p>
                        <p className="text-3xl font-bold text-slate-800">{totalHoursInverted}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <Clock className="h-6 w-6 text-slate-700" />
                    </div>
                </div>
            </div>

            {/* ─── CONTENEDOR PRINCIPAL DEL LISTADO ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Lista de Historial Mantenimientos</h2>
                        <p className="text-xs text-gray-400">Gestiona todas los mantenimientos registrados en el sistema</p>
                    </div>
                    <Button
                        onClick={refresh}
                        disabled={isLoading}
                        variant="outline"
                        className="rounded-xl h-11 gap-2 border-gray-200 text-slate-700 bg-white hover:bg-gray-50 cursor-pointer shadow-none"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Sincronizando...' : 'Actualizar'}
                    </Button>
                </div>

                {/* ─── FILTROS INTERACTIVOS  ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full">

                    {/* 1. Input Buscar por detalle */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar por detalle/descripcion..."
                            value={searchDetails}
                            onChange={(e) => { setSearchDetails(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-9 h-9.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none transition-all shadow-none"
                        />
                        {searchDetails && (
                            <button onClick={() => setSearchDetails('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 2. Filtro por Dispositivo */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setFilterDevice(Number(val)); setPage(1); }} value={filterDevice ? String(filterDevice) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por Dispositivo" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                {deviceCatalog?.map((d) => (
                                    <SelectItem key={d.id} value={String(d.id)} className="cursor-pointer text-sm">{d.brandName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {filterDevice !== undefined && (
                            <button onClick={() => setFilterDevice(undefined)} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 4. Filtro por Usuario Técnico */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setFilterUser(Number(val)); setPage(1); }} value={filterUser ? String(filterUser) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por Técnico" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                {userCatalog?.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)} className="cursor-pointer text-sm">{u.userName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {filterUser !== undefined && (
                            <button onClick={() => setFilterUser(undefined)} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 5. Filtro por Tipo de Dispositivo */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setFilterTypeDevice(Number(val)); setPage(1); }} value={filterTypeDevice ? String(filterTypeDevice) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por Tipo" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                {typeDeviceCatalog?.map((t) => (
                                    <SelectItem key={t.id} value={String(t.id)} className="cursor-pointer text-sm">{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {filterTypeDevice !== undefined && (
                            <button onClick={() => setFilterTypeDevice(undefined)} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                </div>

                {/* ─── TABLA DE DATOS  ─── */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 font-semibold border-b border-gray-200 select-none">
                                <th className="p-3 w-16">No.</th>
                                <th className="p-3">Dispositivo</th>
                                <th className="p-3">Mantenimiento</th>
                                <th className="p-3">Usuario/Tecnico</th>
                                <th className="p-3">Tipo Dispo...</th>
                                <th className="p-3">Detalles</th>
                                <th className="p-3 text-center w-24">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-gray-100 text-slate-700 transition-opacity duration-200 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
                            }`}>
                            {isLoading && filteredHistories.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400 animate-pulse font-medium">
                                        Consultando histórico al servidor central...
                                    </td>
                                </tr>
                            ) : filteredHistories.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400 font-medium">
                                        No se encontraron registros en el historial.
                                    </td>
                                </tr>
                            ) : (
                                filteredHistories.map((row, index) => {
                                    const itemNumber = (page - 1) * pageSize + index + 1;
                                    return (
                                        <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3 font-mono text-gray-400 text-xs font-bold">
                                                {itemNumber}
                                            </td>
                                            <td className="p-3 font-semibold text-slate-800 flex items-center gap-2">
                                                <Laptop className="h-4 w-4 text-slate-400" /> {row.deviceBrand}
                                            </td>
                                            <td className="p-3">
                                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700">
                                                    {row.typeMaintenanceName}
                                                </span>
                                            </td>
                                            <td className="p-3 font-semibold text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5 text-gray-400" />
                                                    {row.technicalName}
                                                </div>
                                            </td>
                                            <td className="p-3 text-slate-500">{row.deviceType}</td>
                                            <td className="p-3 text-slate-500 max-w-xs truncate">{row.maintenanceDetails}</td>
                                            <td className="p-3 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`maintenancehistory/${row.id}`)}
                                                    className="h-8 w-8 text-slate-500 hover:text-[#1a558b] hover:bg-slate-100 rounded-lg cursor-pointer"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
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