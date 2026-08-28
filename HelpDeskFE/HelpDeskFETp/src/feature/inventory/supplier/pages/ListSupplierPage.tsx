import React, { useState } from "react";
import { Edit, Eye, Plus, Search, Trash2, X, AlertTriangle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../../../../@/components/ui/pagination";
import { useSuppliers, type SupplierItem } from "../hooks/useSuppliers";

export const ListSupplierPage: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<SupplierItem | null>(null);
    const pageSize = 5;

    const { suppliers, totalCount, isLoading, deleteSupplier } = useSuppliers(
        search,
        page,
        pageSize,
    );

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    const remove = async () => {
        if (!selected) return;
        try {
            await deleteSupplier(selected.id);
            toast.success("Proveedor desactivado correctamente");
            setSelected(null);
        } catch {
            toast.error("No se pudo desactivar el proveedor");
        }
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">
            {/* Breadcrumbs y Título */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span
                        onClick={() => navigate("/dashboard")}
                        className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                    >
                        Inicio
                    </span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold select-none">Inventario</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Proveedores</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Proveedores
                </h1>
            </div>

            {/* Tarjeta de KPI Superior */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28 relative">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Proveedores</p>
                        <p className="text-3xl font-bold text-slate-800">
                            {totalCount ?? 0 }
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                        <Users className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                {/* Encabezado y Acción */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Lista de Proveedores</h2>
                        <p className="text-xs text-gray-400">
                            Gestiona proveedores y consulta sus reuniones y evidencias asociadas
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("create")}
                        className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#164768] text-white px-4 h-10 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer border-none shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo proveedor
                    </button>
                </div>

                {/* Filtro de Búsqueda */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Buscar por nombre..."
                        className="w-full pl-10 pr-9 h-10 border border-gray-200 rounded-xl text-sm text-slate-700 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all shadow-none"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Tabla de Proveedores */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 text-left font-bold text-xs uppercase tracking-wider">
                                <th className="p-3.5 pl-4">No.</th>
                                <th className="p-3.5">Proveedor</th>
                                <th className="p-3.5">Organización</th>
                                <th className="p-3.5">Contacto</th>
                                <th className="p-3.5">Estado</th>
                                <th className="p-3.5 pr-4 w-32 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-slate-700">
                            {isLoading && !suppliers.length ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-sm font-semibold text-gray-400">
                                        Cargando proveedores...
                                    </td>
                                </tr>
                            ) : suppliers.length ? (
                                suppliers.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-3.5 pl-4 text-xs font-mono text-gray-400">
                                            {(page - 1) * pageSize + index + 1}
                                        </td>
                                        <td className="p-3.5 font-bold text-slate-800">{item.name}</td>
                                        <td className="p-3.5 text-slate-600">{item.organizationName}</td>
                                        <td className="p-3.5 text-slate-500 ">{item.contact}</td>
                                        <td className="p-3.5">
                                            <span
                                                className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold w-24 border ${
                                                    item.isActive
                                                        ? "bg-[#e6f9f0] text-[#1b8a65] border-[#bbf7d0]"
                                                        : "bg-[#fee2e2] text-[#ef4444] border-[#fecaca]"
                                                }`}
                                            >
                                                {item.isActive ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="p-3.5 pr-4">
                                            <div className="flex items-center justify-center gap-2 text-gray-400">
                                                <button
                                                    type="button"
                                                    title="Ver detalle y reuniones"
                                                    onClick={() => navigate(`details/${item.id}`)}
                                                    className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-slate-700 transition-colors cursor-pointer border-none"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Editar"
                                                    onClick={() => navigate(`edit/${item.id}`)}
                                                    className="p-1.5 hover:bg-blue-50 rounded-lg hover:text-[#1e5f8a] transition-colors cursor-pointer border-none"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Desactivar"
                                                    onClick={() => setSelected(item)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg hover:text-red-500 transition-colors cursor-pointer border-none"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-sm font-semibold text-gray-400">
                                        No se encontraron proveedores.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="pt-2">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(Math.max(1, page - 1));
                                        }}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === i + 1}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage(i + 1);
                                            }}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(Math.min(totalPages, page + 1));
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Modal de Desactivación */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-gray-100 animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-50 rounded-xl text-red-500">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-800">Desactivar Proveedor</h2>
                                <p className="text-xs text-gray-400">Confirmación de acción</p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed">
                            ¿Estás seguro de que deseas desactivar a{" "}
                            <span className="font-bold text-slate-800">"{selected.name}"</span>?
                        </p>

                        <div className="flex justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="px-4 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer border-none"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={remove}
                                className="px-4 h-9 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer border-none shadow-sm"
                            >
                                Desactivar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};