import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSoftwareSystems, type SoftwareSystemItem } from '../hooks/useSoftwareSystems';

import {
    Plus,
    Search,
    Eye,
    Trash2,
    Edit,
    X,
    Database
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../../../@/components/ui/pagination';
import { toast } from 'sonner';
import { SoftwareSystemDetailModal } from '../components/SoftwareSystemDetailModal';
import { SoftwareSystemDeleteModal } from '../components/SoftwareSystemDeleteModal';

export const ListSoftwareSystemsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const {
        systems,
        totalCount,
        isLoading,
        deleteSystem,
        refresh
    } = useSoftwareSystems(searchTerm, page, pageSize);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const navigate = useNavigate();

    // ─── ESTADOS PARA MODALES CONTROLADOS ───
    const [selectedSoftware, setSelectedSoftware] = useState<SoftwareSystemItem | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

    const handleDelete = async (id: number) => {
        try {
            await deleteSystem(id);
            toast.success("Sistema desactivado correctamente");
            refresh();
        } catch (error) {
            toast.error("Error al intentar procesar la eliminación del sistema");
            console.error(error);
        }

    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">

            {/* Breadcrumbs */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="text-neutral-300 font-normal">&gt;</span>
                    <span  onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Reporte</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Sistemas Afectados</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Sistemas Afectados
                </h1>
            </div>

            {/* CONTENEDOR DE KPIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Sistemas Registrados</p>
                        <p className="text-3xl font-bold text-slate-800">{totalCount ?? 0}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                        <Database className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Lista de Sistemas Afectados</h2>
                        <p className="text-xs text-gray-400">Catálogo general de plataformas, software e infraestructura tecnológica de la empresa</p>
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        onClick={() => navigate("create")}
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Sistema
                    </button>
                </div>

                {/* BARRA DE FILTROS  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-2">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre de sistema..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full h-9.5 pl-9 pr-9 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                        />
                        {searchTerm && (
                            <button onClick={() => { setSearchTerm(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLA DE DATOS */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 font-semibold border-b border-gray-200">
                                <th className="p-3 w-16 pl-5">No.</th>
                                <th className="p-3">Nombre del Sistema</th>
                                <th className="p-3 w-28 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-gray-100 text-slate-700 transition-opacity duration-200 ${isLoading && systems.length === 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'
                            }`}>
                            {isLoading && systems.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400 animate-pulse">
                                        Sincronizando catálogo de software con el servidor...
                                    </td>
                                </tr>
                            ) : systems.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">
                                        No se encontraron sistemas de software registrados.
                                    </td>
                                </tr>
                            ) : (
                                systems.map((item, index) => {
                                    const itemNumber = (page - 1) * pageSize + index + 1;
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3.5 pl-5 font-mono text-gray-400 text-xs font-semibold">{itemNumber}</td>
                                            <td className="p-3.5 text-[13px] text-slate-800 font-semibold">{item.name}</td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                                    <button type="button" className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => {
                                                        setSelectedSoftware(item);
                                                        setIsDetailsModalOpen(true);
                                                    }} title="Ver detalle"><Eye className="h-4 w-4" /></button>
                                                    <button type="button" className="hover:text-red-500 transition-colors cursor-pointer" onClick={() => {
                                                        setSelectedSoftware(item);
                                                        setIsDeleteModalOpen(true);
                                                    }} title="Eliminar"><Trash2 className="h-4 w-4" /></button>
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
            <SoftwareSystemDetailModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedSoftware(null);
                }}
                system={selectedSoftware}
            />
            <SoftwareSystemDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedSoftware(null);
                }}
                system={selectedSoftware}
                onConfirm={handleDelete}

            />
        </div>
    );
};