import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevices, type DeviceItem } from '../hooks/useDevices';
import { useAreas } from '../../../administrative/areas/hooks/useAreas';
import { useTypeDevices } from '../../typeDevices/hooks/useTypeDevices';
import { useUsers } from '../../../administrative/users/hooks/useUser';

import {
    Plus,
    Search,
    Eye,
    Trash2,
    Edit,
    X,
    Laptop
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../../../@/components/ui/pagination';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../@/components/ui/select';
import { DeviceDeleteModal } from '../components/DeviceDeleteModal';

export const ListDevicesPage: React.FC = () => {
    // ─── ESTADOS DE FILTROS INTERACTIVOS ───
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<number | undefined>(undefined);
    const [selectedArea, setSelectedArea] = useState<number | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<number | undefined>(undefined);

    const [page, setPage] = useState(1);
    const pageSize = 5;

    // Hook principal de dispositivos
    const {
        devices,
        totalCount,
        isLoading,
        deleteDevice
    } = useDevices(searchTerm, page, pageSize, selectedUser, selectedArea, selectedType);

    //  2. CONSUMO DE ENDPOINTS RELACIONALES (Traemos hasta 100 registros para llenar los combos)
    const { users } = useUsers('', null, null, null, null, 1, 100);
    const { areas } = useAreas('', '', 1, 100);
    const { devices: typeDevices } = useTypeDevices('', 1, 100);

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

    // ─── ESTADOS PARA MODALES ───
    const [selectedDevice, setSelectedDevice] = useState<DeviceItem | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleConfirmDelete = async (id: number) => {
        try {
            await deleteDevice(id);
            toast.success("Dispositivo dado de baja correctamente");
            setIsDeleteModalOpen(false);
            setSelectedDevice(null);
        } catch (error) {
            toast.error("Error al intentar procesar la baja del dispositivo");
            console.error(error);
        }
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">

            {/* Historial superior (Breadcrumbs de Inventario) */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inventario</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Dispositivos</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Dispositivos
                </h1>
            </div>

            {/* CONTENEDOR DE KPIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Dispositivos Hardware</p>
                        <p className="text-3xl font-bold text-slate-800">
                            {totalCount ?? 0}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                        <Laptop className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL DEL LISTADO */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Lista de Dispositivos</h2>
                        <p className="text-xs text-gray-400">Administración general, codificación patrimonial y asignaciones operativas</p>
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        onClick={() => navigate("create")}
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Dispositivo
                    </button>
                </div>

                {/* ─── BARRA DE FILTROS ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-2">

                    {/* Buscador por marca/modelo */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por marca/modelo..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full h-9.5 pl-9 pr-9 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/*  Filtro por Tipo de Hardware */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setSelectedType(Number(val)); setPage(1); }} value={selectedType ? String(selectedType) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por Tipo" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                {typeDevices?.map((t) => (
                                    <SelectItem key={t.id} value={String(t.id)} className="cursor-pointer text-sm">{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedType && (
                            <button onClick={() => setSelectedType(undefined)} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0"><X className="h-4 w-4" /></button>
                        )}
                    </div>

                    {/*  Filtro por Usuario Responsable  */}
                    <div className="flex items-center gap-2 w-full">
                        <Select onValueChange={(val) => { setSelectedUser(Number(val)); setPage(1); }} value={selectedUser ? String(selectedUser) : ""}>
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 w-full bg-white shadow-none">
                                <SelectValue placeholder="Filtrar por Usuario" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                {users?.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)} className="cursor-pointer text-sm">{u.userName || u.userName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedUser && (
                            <button onClick={() => setSelectedUser(undefined)} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0"><X className="h-4 w-4" /></button>
                        )}
                    </div>

                    {/* Filtro por Área / Departamento  */}
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
                            <button onClick={() => setSelectedArea(undefined)} className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-500 cursor-pointer shrink-0"><X className="h-4 w-4" /></button>
                        )}
                    </div>

                </div>

                {/* TABLA DE DATOS */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 font-semibold border-b border-gray-200">
                                <th className="p-3 w-16">No.</th>
                                <th className="p-3">Marca/Modelo</th>
                                <th className="p-3">Código</th>
                                <th className="p-3">Tipo</th>
                                <th className="p-3">Usuario</th>
                                <th className="p-3">Área</th>
                                <th className="p-3 w-32">Estado</th>
                                <th className="p-3 w-28 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-gray-100 text-slate-700 transition-opacity duration-200 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
                            }`}>
                            {isLoading && devices.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-400 animate-pulse">
                                        Sincronizando inventario de hardware con el servidor...
                                    </td>
                                </tr>
                            ) : devices.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-400">
                                        No se encontraron dispositivos con los filtros seleccionados.
                                    </td>
                                </tr>
                            ) : (
                                devices.map((item, index) => {
                                    const itemNumber = (page - 1) * pageSize + index + 1;
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3 font-mono text-gray-400 text-xs font-semibold">{itemNumber}</td>
                                            <td className="p-3.5 text-[13px] text-slate-700 font-medium truncate max-w-40" title={item.brandName}>{item.brandName}</td>
                                            <td className="p-3 text-gray-500 ">{item.code}</td>
                                            <td className="p-3 text-gray-500 ">{item.deviceTypeName}</td>
                                            <td className="p-3 text-gray-500 ">{item.userName}</td>
                                            <td className="p-3 text-gray-500 " title={item.areaName}>{item.areaName}</td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold w-24 border ${item.isActive
                                                        ? 'bg-[#e6f9f0] text-[#1b8a65] border-[#bbf7d0]'
                                                        : 'bg-[#fee2e2] text-[#ef4444] border-[#fecaca]'
                                                    }`}>
                                                    {item.isActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                                    <button type="button" className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => navigate(`details/${item.id}`)} title="Ver detalle"><Eye className="h-4 w-4" /></button>
                                                    <button type="button" className="hover:text-red-500 transition-colors cursor-pointer" onClick={() => { setSelectedDevice(item); setIsDeleteModalOpen(true); }} title="Dar de Baja"><Trash2 className="h-4 w-4" /></button>
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
            <DeviceDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedDevice(null);
                }}
                onConfirm={handleConfirmDelete}
                device={selectedDevice} />
        </div>
    );
};