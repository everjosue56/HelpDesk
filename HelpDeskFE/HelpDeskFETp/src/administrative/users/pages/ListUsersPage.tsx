import React, { useState } from 'react';
import { useUsers, type UserItem } from '../hooks/useUser';
import { useAreas } from '../../areas/hooks/useAreas';
import {
    Plus,
    Search,
    Eye,
    Trash2,
    Edit,
    X,
    Users
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../../@/components/ui/pagination';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../@/components/ui/select';
import { UserDeleteModal } from '../components/UserDeleteModal';

export const ListUsersPage: React.FC = () => {
    const navigate = useNavigate();

    // ─── ESTADOS DE FILTROS ───
    const [keyword, setKeyword] = useState('');
    const [idArea, setIdArea] = useState<number | null>(null);
    const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);
    const [idRol, setIdRol] = useState<number | null>(null);

    // Paginación continua
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // ─── CONSUMO DE HOOKS CON TU ESTÁNDAR ───
    const {
        users,
        totalCount,
        isLoading,
        totalActivos,
        totalInactivos,
        deleteUser
    } = useUsers(keyword, idRol, null, idArea, isActiveFilter, page, pageSize);

    // Alimentación de los Selectores de filtros correlacionados
    const { areas } = useAreas('', '', 1, 100);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    // Manejadores de Paginación Indexada
    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        if (page > 1) setPage(page - 1);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (page < totalPages) setPage(page + 1);
    };

    // Estados de control para Modales
    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleConfirmDelete = async (id: number) => {
        try {
            await deleteUser(id);
            toast.success("Usuario desactivado correctamente");
        } catch (error) {
            toast.error("Error al intentar desactivar el usuario");
            console.error(error);
        }
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

            {/* Historial superior (Breadcrumbs) */}
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
                    <span className="text-neutral-400 font-semibold">Usuarios</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Usuarios
                </h1>
            </div>

            {/* ─── CONTENEDOR DE KPIS (DOBLE PANEL SUPERIOR ANTIPARPADEO) ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* KPI: Usuarios Activos */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-base font-bold text-gray-500">Usuarios Activos</p>
                        <p className="text-4xl font-black text-slate-800">{totalActivos ?? 0}</p>
                    </div>
                    <div className="p-4 bg-[#1a558b]/10 rounded-2xl text-[#1a558b]">
                        <Users className="h-7 w-7" />
                    </div>
                </div>

                {/* KPI: Usuarios Inactivos */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-base font-bold text-gray-500">Usuarios Inactivos</p>
                        <p className="text-4xl font-black text-slate-800">{totalInactivos ?? 0}</p>
                    </div>
                    <div className="p-4 bg-slate-800/10 rounded-2xl text-slate-800">
                        <Users className="h-7 w-7" />
                    </div>
                </div>
            </div>

            {/* ─── CONTENEDOR PRINCIPAL DEL LISTADO ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">

                {/* Cabecera de la sección y Botón Nuevo Usuario */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Lista de Usuarios</h2>
                        <p className="text-xs text-gray-400">Gestiona todas los usuarios registrados en el sistema</p>
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 bg-[#1b5e8c] hover:bg-[#134466] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        onClick={() => navigate("create")}
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Usuario
                    </button>
                </div>

                {/* ─── CONTENEDOR DE FILTROS INTERACTIVOS ESTÁNDAR ─── */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">

                    {/* Input: Palabra clave (Keyword) */}
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={keyword}
                            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all h-9.5"
                        />
                        {keyword && (
                            <button
                                onClick={() => setKeyword('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Selector 1: Filtrar por Área */}
                    <div className="flex items-center gap-2 w-full sm:max-w-xs">
                        <Select
                            onValueChange={(val) => { setIdArea(val ? Number(val) : null); setPage(1); }}
                            value={idArea ? String(idArea) : ""}
                        >
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full bg-white select-none shadow-none">
                                <SelectValue placeholder="Filtrar por Área" className='text-gray-400!' />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                {areas.map((area) => (
                                    <SelectItem key={area.id} value={String(area.id)} className="cursor-pointer text-sm">
                                        {area.nameArea}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {idArea && (
                            <button
                                onClick={() => setIdArea(null)}
                                className="p-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 rounded-xl text-slate-500 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                                title="Limpiar filtro de área"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Selector 2: Filtrar por Estado */}
                    <div className="flex items-center gap-2 w-full sm:max-w-xs">
                        <Select
                            onValueChange={(val) => {
                                setIsActiveFilter(val === 'true' ? true : val === 'false' ? false : null);
                                setPage(1);
                            }}
                            value={isActiveFilter !== null ? String(isActiveFilter) : ""}
                        >
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full bg-white select-none shadow-none">
                                <SelectValue placeholder="Filtrar por Estado" className='text-gray-400!' />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                <SelectItem value="true" className="cursor-pointer text-sm">Activo</SelectItem>
                                <SelectItem value="false" className="cursor-pointer text-sm">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>

                        {isActiveFilter !== null && (
                            <button
                                onClick={() => setIsActiveFilter(null)}
                                className="p-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 rounded-xl text-slate-500 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                                title="Limpiar filtro de estado"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Selector 3: Filtrar por Rol */}
                    <div className="flex items-center gap-2 w-full sm:max-w-xs">
                        <Select
                            onValueChange={(val) => { setIdRol(val ? Number(val) : null); setPage(1); }}
                            value={idRol ? String(idRol) : ""}
                        >
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full bg-white select-none shadow-none">
                                <SelectValue placeholder="Filtrar por Rol" className='text-gray-400!' />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                <SelectItem value="1" className="cursor-pointer text-sm">Administrador</SelectItem>
                                <SelectItem value="2" className="cursor-pointer text-sm">Técnico</SelectItem>
                                <SelectItem value="3" className="cursor-pointer text-sm">Cliente</SelectItem>
                            </SelectContent>
                        </Select>

                        {idRol && (
                            <button
                                onClick={() => setIdRol(null)}
                                className="p-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 rounded-xl text-slate-500 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                                title="Limpiar filtro de rol"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                </div>

                {/* ─── TABLA DE DATOS INDEXADA CON OPACIDAD FLUIDA ─── */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 font-semibold border-b border-gray-200">
                                <th className="p-3 w-16">No.</th>
                                <th className="p-3">Nombre Completo</th>
                                <th className="p-3">Agencia</th>
                                <th className="p-3">Rol</th>
                                <th className="p-3">Area</th>
                                <th className="p-3 w-32 text-center">Estado</th>
                                <th className="p-3 w-28 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-gray-100 text-slate-700 transition-opacity duration-200 ${
                            isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
                        }`}>
                            {isLoading && users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400 animate-pulse">
                                        Cargando catálogo de usuarios de forma segura...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400">
                                        No se encontraron usuarios registrados.
                                    </td>
                                </tr>
                            ) : (
                                users.map((userItem, index) => {
                                    const itemNumber = (page - 1) * pageSize + index + 1;

                                    return (
                                        <tr key={userItem.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3 font-mono text-gray-400 text-xs font-semibold">
                                                {itemNumber}
                                            </td>
                                            <td
                                                className="p-3 font-medium text-slate-800 truncate max-w-48"
                                                title={`${userItem.firstName} ${userItem.lastName}`}
                                            >
                                                {userItem.firstName} {userItem.lastName}
                                            </td>
                                            <td className="p-3 text-gray-500 truncate max-w-56" title={userItem.agencyName}>
                                                {userItem.agencyName}
                                            </td>
                                            <td className="p-3 text-gray-500">{userItem.roleName}</td>
                                            <td className="p-3 text-gray-500">{userItem.areaName}</td>
                                            <td className="p-3 text-center">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold w-24 border ${userItem.isActive
                                                    ? 'bg-[#e6f9f0] text-[#1b8a65] border-[#bbf7d0]'
                                                    : 'bg-[#fee2e2] text-[#ef4444] border-[#fecaca]'
                                                    }`}>
                                                    {userItem.isActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                                    <button
                                                        className="hover:text-slate-600 transition-colors cursor-pointer"
                                                        onClick={() => navigate(`details/${userItem.id}`)}
                                                        title="Ver detalle"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="hover:text-red-500 transition-colors cursor-pointer"
                                                        onClick={() => { setSelectedUser(userItem); setIsDeleteModalOpen(true); }}
                                                        title="Desactivar usuario"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="hover:text-[#1b5e8c] transition-colors cursor-pointer"
                                                        onClick={() => navigate(`edit/${userItem.id}`)}
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

                {/* ─── SECCIÓN DE PAGINACIÓN INDEXADA ─── */}
                {totalPages > 1 && (
                    <div className="pt-4 flex justify-center">
                        <Pagination>
                            <PaginationContent className="text-xs font-bold text-neutral-500 gap-1 select-none">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={handlePrevious}
                                        className={`rounded-lg h-8 px-2.5 text-xs font-bold transition-colors cursor-pointer ${page === 1 ? "pointer-events-none opacity-40" : "hover:bg-slate-50 text-neutral-600"}`}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }, (_, idx) => {
                                    const pageNum = idx + 1;
                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); setPage(pageNum); }}
                                                isActive={page === pageNum}
                                                className={`rounded-lg w-8 h-8 text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${page === pageNum ? "bg-[#1a558b] text-white hover:bg-[#1a558b]" : "hover:bg-slate-50 text-neutral-600"}`}
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={handleNext}
                                        className={`rounded-lg h-8 px-2.5 text-xs font-bold transition-colors cursor-pointer ${page === totalPages ? "pointer-events-none opacity-40" : "hover:bg-slate-50 text-neutral-600"}`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            <UserDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleConfirmDelete}
                user={selectedUser}
            />
        </div>
    );
};