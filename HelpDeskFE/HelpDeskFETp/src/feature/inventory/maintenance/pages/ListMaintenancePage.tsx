import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMaintenances, type MaintenanceItem } from '../hooks/useMaintenances';
import { useDevices } from '../../devices/hooks/useDevices';
import { useAreas } from '../../../administrative/areas/hooks/useAreas';
import { useTypeMaintenance } from '../../typeMaintenance/hooks/useTypeMaintenance';

import {
    Plus,
    Search,
    Eye,
    Trash2,
    Edit,
    X,
    Settings,
    Calendar,
    RotateCw,
    FileSpreadsheet
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../../../@/components/ui/pagination';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../@/components/ui/select';
import { MaintenanceDeleteModal } from '../components/MaintenanceDeleteModal';
import { MaintenanceCalendarModal } from '../components/MaintenanceCalendarModal';
import { MaintenanceRenewModal } from '../components/MaintenanceRenewModal';
import type { RenewMaintenanceDto } from '@/api/model/renewMaintenanceDto';

export const ListMaintenancePage: React.FC = () => {
    // ─── ESTADOS DE FILTROS INTERACTIVOS ───
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDevice, setSelectedDevice] = useState<number | undefined>(undefined);
    const [selectedArea, setSelectedArea] = useState<number | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<number | undefined>(undefined);
    const [filterDate, setFilterDate] = useState<string>('');
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const {
        maintenances,
        totalCount,
        isLoading,
        deleteMaintenance,
        renewMaintenance,
        downloadExcel,
    } = useMaintenances(searchTerm, page, pageSize, selectedType, selectedArea, selectedDevice, undefined, filterDate || null, filterDate || null);

    // ─── CONSUMO DE HOOKS RELACIONALES PARA FILTROS ───
    const { devices } = useDevices('', 1, 100);
    const { areas } = useAreas('', '', 1, 100);
    const { typeMaintenance } = useTypeMaintenance('', 1, 100);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const navigate = useNavigate();

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

    // ─── FORMATEO DE FECHAS ───
    const formatDate = (dateStr: string) => {
        if (!dateStr || dateStr.startsWith('0001-01-01')) return 'N/A';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    // ─── ESTADOS PARA MODALES DE ACCIÓN ───
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceItem | null>(null);
    const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
    const [selectedMaintenanceForRenew, setSelectedMaintenanceForRenew] = useState<MaintenanceItem | null>(null);
        const [isExportingExcel, setIsExportingExcel] = useState(false);
    

    const handleConfirmDelete = async (id: number) => {
        try {
            await deleteMaintenance(id);
            toast.success("Mantenimiento eliminado correctamente del historial");
            setIsDeleteModalOpen(false);
            setSelectedMaintenance(null);
        } catch (error) {
            toast.error("Error al intentar eliminar el registro de mantenimiento");
            console.error(error);
        }
    };

    const handleConfirmRenew = async (id: number, dto: RenewMaintenanceDto) => {
        await renewMaintenance(id, dto);
    };

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

            {/* Breadcrumbs e Historial superior */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inventario</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Mantenimiento</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Mantenimiento
                </h1>
            </div>

            {/* CONTENEDOR DE KPIS  ) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Mantenimientos</p>
                        <p className="text-3xl font-bold text-slate-800">
                            {totalCount ?? 0}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                        <Settings className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL DEL LISTADO */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Lista de Mantenimientos</h2>
                        <p className="text-sm text-gray-500">Gestiona todas los mantenimientos registrados en el sistema</p>
                    </div>
                    <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportExcel}
                        disabled={isExportingExcel}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-sm h-10 px-4 cursor-pointer transition-colors text-sm disabled:opacity-50 border-none"
                    >
                        <FileSpreadsheet  className="w-4 h-4" />
                        {isExportingExcel ? 'Exportando...' : 'Exportar Excel'}
                    </button>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
                            onClick={() => setIsCalendarModalOpen(true)}
                        >
                            <Calendar className="h-4 w-4 text-[#1e5f8a]" />
                            Ver Calendario
                        </button>
                        <button
                            className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                            onClick={() => navigate("create")}
                        >
                            <Plus className="h-4 w-4 stroke-3" />
                            Nuevo Mantenimiento
                        </button>
                    </div>
                </div>

                {/* ─── BARRA DE 5 FILTROS ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full pt-2">

                    {/* 1. Buscador por detalle */}
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar detalle..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                className="w-full h-9.5 pl-9 pr-4 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                            />
                        </div>
                        {searchTerm && (
                            <button onClick={() => { setSearchTerm(''); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 2. Filtro por Dispositivo */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setSelectedDevice(Number(val)); setPage(1); }} value={selectedDevice ? String(selectedDevice) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por dispo..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                {devices?.map((d) => (
                                    <SelectItem key={d.id} value={String(d.id)} className="cursor-pointer text-sm">{d.brandName} - {d.code}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedDevice && (
                            <button onClick={() => { setSelectedDevice(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 3. Filtro por Área */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setSelectedArea(Number(val)); setPage(1); }} value={selectedArea ? String(selectedArea) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por Área" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                {areas?.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)} className="cursor-pointer text-sm">{a.nameArea || a.nameArea}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedArea && (
                            <button onClick={() => { setSelectedArea(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 4. Filtro por Fecha Realizado */}
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative w-full">
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
                                className={`w-full h-9.5 px-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all ${!filterDate ? 'text-gray-400' : 'text-slate-700'}`}
                            />
                            {!filterDate && (
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none bg-white pr-2">
                                    Fecha realizado
                                </span>
                            )}
                        </div>
                        {filterDate && (
                            <button onClick={() => { setFilterDate(''); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* 5. Filtro por Tipo de Mantenimiento */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setSelectedType(Number(val)); setPage(1); }} value={selectedType ? String(selectedType) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Tipo de manteni..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                {typeMaintenance?.map((t) => (
                                    <SelectItem key={t.id} value={String(t.id)} className="cursor-pointer text-sm">{t.name || t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedType && (
                            <button onClick={() => { setSelectedType(undefined); setPage(1); }} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLA DE DATOS */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 font-bold border-b border-gray-200">
                                <th className="p-3.5 pl-5 w-16">No.</th>
                                <th className="p-3.5">Dispositivo</th>
                                <th className="p-3.5">Tipo de Mantenimiento</th>
                                <th className="p-3.5">Fecha Realizado</th>
                                <th className="p-3.5">Area</th>
                                <th className="p-3.5">Detalles</th>
                                <th className="p-3.5 w-28 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-gray-100 text-slate-600 transition-opacity duration-200 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
                            }`}>
                            {isLoading && maintenances.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400 animate-pulse">
                                        Cargando historial de mantenimientos...
                                    </td>
                                </tr>
                            ) : maintenances.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400">
                                        No se encontraron registros de mantenimiento con los filtros actuales.
                                    </td>
                                </tr>
                            ) : (
                                maintenances.map((item, index) => {
                                    const itemNumber = (page - 1) * pageSize + index + 1;   

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3.5 pl-5 font-mono text-gray-500 text-[13px]">{itemNumber}</td>
                                            <td className="p-3.5 text-[13px] text-slate-700 font-medium truncate max-w-40" title={item.deviceFullDescription}>{item.deviceFullDescription}</td>
                                            <td className="p-3.5 text-[13px]">{item.maintenanceTypeName}</td>
                                            <td className="p-3.5 text-[13px]">{formatDate(item.completionDate)}</td>
                                            <td className="p-3.5 text-[13px] truncate max-w-32">{item.areaName}</td>
                                            <td className="p-3.5 text-[13px] truncate max-w-40 text-gray-500" title={item.details}>
                                                {item.details.length > 25 ? `${item.details.substring(0, 25)}...` : item.details}
                                            </td>
                                            <td className="p-3.5">
                                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                                    <button
                                                        type="button"
                                                        className="hover:text-emerald-600 transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedMaintenanceForRenew(item);
                                                            setIsRenewModalOpen(true);
                                                        }}
                                                        title="Renovar mantenimiento"
                                                    >
                                                        <RotateCw className="h-4 w-4" />
                                                    </button>
                                                    <button type="button" className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => navigate(`details/${item.id}`)} title="Ver detalle"><Eye className="h-4 w-4" /></button>
                                                    <button type="button" className="hover:text-red-500 transition-colors cursor-pointer" onClick={() => { setSelectedMaintenance(item); setIsDeleteModalOpen(true); }} title="Eliminar"><Trash2 className="h-4 w-4" /></button>
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

                {/* PAGINACIÓN INDEXADA */}
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
            <MaintenanceDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedMaintenance(null);
                }}
                onConfirm={handleConfirmDelete}
                maintenance={selectedMaintenance}
            />
            {/* MODAL DE CALENDARIO */}
            <MaintenanceCalendarModal
                isOpen={isCalendarModalOpen}
                onClose={() => setIsCalendarModalOpen(false)}
            />
            <MaintenanceRenewModal
                key={`${selectedMaintenanceForRenew?.id ?? 'new'}-${isRenewModalOpen ? 'open' : 'closed'}`}
                isOpen={isRenewModalOpen}
                onClose={() => {
                    setIsRenewModalOpen(false);
                    setSelectedMaintenanceForRenew(null);
                }}
                maintenance={selectedMaintenanceForRenew}
                onConfirmRenew={handleConfirmRenew}
            />
        </div>
    );
};