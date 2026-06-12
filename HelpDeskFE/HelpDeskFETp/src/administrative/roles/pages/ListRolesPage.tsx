import React from 'react';
import { useRoles } from '../hooks/useRoles';
import { useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';

export const ListRolesPage: React.FC = () => {
    const { roles, totalCount, isLoading } = useRoles();
    const navigate = useNavigate();

    const getPermissionBadgeClass = (level: string) => {
        const normalized = level.toLowerCase();
        if (normalized.includes('total') || normalized.includes('administrador')) {
            return 'bg-[#2A3439] text-white border-transparent';
        }
        if (normalized.includes('soporte') || normalized.includes('tecnico')) {
            return 'bg-[#1a558b] text-white border-transparent';
        }
        return 'bg-neutral-400 text-white border-transparent';
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

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
                    <span className="text-neutral-400 font-semibold">Roles y Permisos</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Roles
                </h1>
            </div>

            {/* ─── CONTENEDOR DE KPI REPLICADO ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center max-w-sm">
                    <div className="space-y-1">
                        <p className="text-base font-bold text-gray-500 tracking-tight">Total Roles</p>
                        <p className="text-4xl font-black text-neutral-700">{totalCount || 0}</p>
                    </div>
                    <div className="p-3.5 bg-slate-100 border border-gray-200 rounded-xl">
                        <FiShield className="h-7 w-7 text-slate-700" />
                    </div>
                </div>
            </div>

            {/* ─── CONTENEDOR PRINCIPAL DE LA TABLA ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                <div>
                    <h2 className="text-lg font-bold text-slate-800">Lista de Roles</h2>
                    <p className="text-xs text-gray-400 font-medium">Catalogo Descriptivo de Accesos y Permisos</p>
                </div>

                {/* Tabla de datos estructurada */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 font-bold border-b border-gray-200">
                                <th className="p-3.5 w-24">ID</th>
                                <th className="p-3.5 w-48">Nombre</th>
                                <th className="p-3.5">Descripcion del Acceso</th>
                                <th className="p-3.5 w-48 text-center">Nivel de Permisos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400 animate-pulse font-medium">
                                        Cargando catálogo de seguridad...
                                    </td>
                                </tr>
                            ) : roles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400 font-medium">
                                        No se encontraron roles configurados en el sistema.
                                    </td>
                                </tr>
                            ) : (
                                roles.map((role) => (
                                    <tr key={role.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-3.5 font-mono text-gray-400 text-xs font-semibold">
                                            {role.id}
                                        </td>
                                        <td className="p-3.5 font-bold text-slate-800"> 
                                            {role.name}
                                        </td>
                                        <td className="p-3.5 text-gray-500 text-mx max-w-xl">
                                            <div
                                                className="line-clamp-2 leading-relaxed"
                                                title={role.description}
                                            >
                                                {role.description}
                                            </div>
                                        </td>
                                        <td className="p-3.5 text-gray-500 text-xs max-w-xl">
                                            <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-bold w-36 border shadow-xs tracking-wide ${getPermissionBadgeClass(role.permissionLevel)}`}>
                                                {role.permissionLevel}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};