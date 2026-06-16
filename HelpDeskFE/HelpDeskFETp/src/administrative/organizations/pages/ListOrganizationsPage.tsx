import React, { useState } from 'react';
import { useOrganizations } from '../hooks/useOrganizations';
import { useNavigate } from 'react-router-dom';
import { OrganizationDetailModal } from '../components/OrganizationDetailModal';
import type { OrganizationItem } from '../hooks/useOrganizations';
import { OrganizationDeleteModal } from '../components/OrganizationDeleteModal';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../../@/components/ui/pagination';
import { Search, X, Building2, Plus, Eye, Trash2, Edit } from 'lucide-react';

export const OrganizationsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 5;

    const { organizations, totalCount, isLoading, deleteOrganization, getOrganizationById } = useOrganizations(searchTerm, currentPage, pageSize);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [orgToDelete, setOrgToDelete] = useState<OrganizationItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
    const [selectedOrg, setSelectedOrg] = useState<OrganizationItem | null>(null);

    const handleOpenDetail = async (id: number) => {
        const fullData = await getOrganizationById(id);
        if (fullData) {
            setSelectedOrg(fullData);
            setIsDetailOpen(true);
        }
    };

    const handleOpenDelete = (org: OrganizationItem) => {
        setOrgToDelete(org);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async (id: number) => {
        await deleteOrganization(id);
    };

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePageClick = (e: React.MouseEvent, pageNumber: number) => {
        e.preventDefault();
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

            {/* Historial superior */}
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
                    <span className="text-neutral-400 font-semibold">Organizaciones</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Organizaciones
                </h1>
            </div>

            {/* ─── CONTENEDOR DE KPIS (ANTIPARPADEO) ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Organizaciones</p>
                        <p className="text-3xl font-bold text-slate-800">
                            {totalCount ?? 0}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
                        <Building2 className="h-6 w-6 text-slate-600" />
                    </div>
                </div>
            </div>

            {/* ─── CONTENEDOR PRINCIPAL DEL LISTADO ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                {/* Fila del Título de la sección y Botón Agregar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Lista de Organizaciones</h2>
                        <p className="text-xs text-gray-400">Gestiona todas las organizaciones registradas en el sistema</p>
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        onClick={() => { navigate("create") }}
                    >
                        <Plus className="h-4 w-4" />
                        Nueva Organización
                    </button>
                </div>

                {/* Barra de Búsqueda Interactiva con Borrado Rápido */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* ─── TABLA DE DATOS CON OPACIDAD FLUIDA ─── */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 font-semibold border-b border-gray-200">
                                <th className="p-3 w-16">No.</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Contacto</th>
                                <th className="p-3">Dirección</th>
                                <th className="p-3 w-28 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-gray-100 text-slate-700 transition-opacity duration-200 ${
                            isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
                        }`}>
                            {/* Solo si la lista viene completamente vacía de fábrica y está cargando mostramos el pulse */}
                            {isLoading && organizations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400 animate-pulse">
                                        Cargando organizaciones de forma segura...
                                    </td>
                                </tr>
                            ) : organizations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">
                                        No se encontraron organizaciones registradas.
                                    </td>
                                </tr>
                            ) : (
                                organizations.map((org, index) => {
                                    const itemNumber = (currentPage - 1) * pageSize + index + 1;

                                    return (
                                        <tr key={org.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3 font-mono text-gray-400 text-xs font-semibold">
                                                {itemNumber}
                                            </td>
                                            <td className="p-3 font-medium text-slate-800 truncate max-w-55" title={org.name}>
                                                {org.name}
                                            </td>
                                            <td className="p-3 text-gray-500">{org.contact}</td>
                                            <td className="p-3 text-gray-500 truncate max-w-60" title={org.address}>
                                                {org.address}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                                    <button
                                                        className="hover:text-slate-600 transition-colors cursor-pointer"
                                                        onClick={() => handleOpenDetail(org.id)}
                                                        title="Ver detalle"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="hover:text-red-500 transition-colors cursor-pointer"
                                                        onClick={() => handleOpenDelete(org)}
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="hover:text-[#1e5f8a] transition-colors cursor-pointer"
                                                        onClick={() => navigate(`edit/${org.id}`)}
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ─── PAGINACIÓN INDEXADA ─── */}
                {totalPages > 1 && (
                    <div className="pt-4 flex justify-center">
                        <Pagination>
                            <PaginationContent className="text-xs font-bold text-neutral-500 gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={handlePrevious}
                                        className={`rounded-lg h-8 px-2.5 text-xs font-bold transition-colors cursor-pointer ${currentPage === 1
                                            ? "pointer-events-none opacity-40 select-none"
                                            : "hover:bg-slate-50 text-neutral-600"
                                        }`}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => handlePageClick(e, pageNumber)}
                                                isActive={currentPage === pageNumber}
                                                className={`rounded-lg w-8 h-8 text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${currentPage === pageNumber
                                                    ? "bg-[#1a558b] text-white hover:bg-[#1a558b] hover:text-white"
                                                    : "hover:bg-slate-50 text-neutral-600"
                                                }`}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={handleNext}
                                        className={`rounded-lg h-8 px-2.5 text-xs font-bold transition-colors cursor-pointer ${currentPage === totalPages
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

            {/* Modales */}
            <OrganizationDetailModal
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedOrg(null);
                }}
                organization={selectedOrg}
            />

            <OrganizationDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setOrgToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                organization={orgToDelete}
            />
        </div>
    );
};