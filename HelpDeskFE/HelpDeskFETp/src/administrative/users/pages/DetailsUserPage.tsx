import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUser';  
import { Copy, Edit3, ArrowLeft, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

export const DetailsUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userId = Number(id);

    const { user, isFetching, getUserById } = useUsers('', null, null, null, null, 1, 1);
    useEffect(() => {
        if (userId) {
            getUserById(userId);
        }
    }, [userId, getUserById]);


    const handleCopyClipboard = async () => {
        if (!user) return;

        const textToCopy = `
        Nombre Completo: ${user.firstName} ${user.lastName}
        Usuario: ${user.userName}
        Correo Electrónico: ${user.email}
        Teléfono: ${user.phoneNumber}
        Rol Asignado: ${user.roleName}
        Agencia: ${user.agencyName}
        Área: ${user.areaName}
        Estado: ${user.isActive ? 'Activo' : 'Inactivo'}
        `.trim().replace(/^[ \t]+/gm, ''); 

        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success("Datos del usuario copiados al portapapeles");
        } catch (err) {
            console.error("Error al copiar al portapapeles: ", err);
            toast.error("No se pudieron copiar los datos");
        }
    };

    const formatFecha = (fechaStr?: string) => {
        if (!fechaStr || fechaStr === 'N/A') return 'N/A';

        const fecha = new Date(fechaStr);
        return new Intl.DateTimeFormat('es-HN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(fecha);
    };

    // ─── ESTADO DE CARGA  ───
    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 animate-fadeIn text-left">
                <Loader2 className="h-8 w-8 animate-spin text-[#1e5f8a]" />
                <p className="text-sm font-medium">Cargando perfil del usuario...</p>
            </div>
        );
    }

    // ─── MANEJO DE REGISTRO NO ENCONTRADO  ) ───
    if (!user) {
        return (
            <div className="p-6 text-center space-y-4 animate-fadeIn">
                <p className="text-gray-500 font-medium">No se encontraron los detalles del usuario solicitado.</p>
                <button
                    onClick={() => navigate('/administrative/users')}
                    className="inline-flex items-center gap-2 text-sm text-[#1e5f8a] hover:underline cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver al listado
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

            {/* Historial superior   */}
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
                        onClick={() => navigate('/administrative/organizations')}
                        className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                    >
                        Administrativo
                    </span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span
                        onClick={() => navigate('/dashboard/users')}
                        className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                    >
                        Usuarios
                    </span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Detalles</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Usuarios
                </h1>
            </div>

            {/* ─── TARJETA CONTENEDORA PRINCIPAL ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8 relative">

                {/* Cabecera Interna: Títulos y Botones de Acción */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                            <User className="h-6 w-6 text-[#1a558b]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Perfil del Usuario</h2>
                            <p className="text-sm text-gray-400 mt-0.5">Información detallada de la cuenta seleccionada</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Botón Copiar Datos */}
                        <button
                            onClick={handleCopyClipboard}
                            className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar Datos
                        </button>

                        {/* Botón Editar Usuario */}
                        <button
                            onClick={() => navigate(`/dashboard/users/edit/${id}`)}
                            className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                            <Edit3 className="h-3.5 w-3.5" />
                            Editar Usuario
                        </button>
                    </div>
                </div>

                {/* ─── GRID DE INFORMACIÓN GENERAL  ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

                    {/* 1. Nombre Completo */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Nombre Completo</h3>
                        <p className="text-sm text-gray-500 font-medium" title={`${user.firstName} ${user.lastName}`}>
                            {user.firstName} {user.lastName}
                        </p>
                    </div>

                    {/* 2. Nombre de Usuario (userName)  */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Nombre de Usuario</h3>
                        <p className="text-sm text-gray-500 font-mono font-medium">@{user.userName || 'N/A'}</p>
                    </div>

                    {/* 3. Correo Electrónico */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Correo Electrónico</h3>
                        <p className="text-sm text-[#1e5f8a] font-medium underline break-all">
                            {user.email || 'N/A'}
                        </p>
                    </div>

                    {/* 4. Teléfono (phoneNumber)  */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Teléfono / Contacto</h3>
                        <p className="text-sm text-gray-500 font-medium">{user.phoneNumber || 'N/A'}</p>
                    </div>

                    {/* 5. Rol del Usuario */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Rol Institucional</h3>
                        <p className="text-sm text-gray-500 font-medium">{user.roleName || 'N/A'}</p>
                    </div>

                    {/* 6. Agencia Asignada */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Agencia</h3>
                        <p className="text-sm text-gray-500 font-medium">{user.agencyName || 'N/A'}</p>
                    </div>

                    {/* 7. Área Organizativa */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-600">Área Asignada</h3>
                        <p className="text-sm text-gray-500 font-medium">{user.areaName || 'N/A'}</p>
                    </div>

                    {/* 8. Estado de la Cuenta */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-600">Estado de Cuenta</h3>
                        <div>
                            <span className={`inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold min-w-32 text-white shadow-sm ${user.isActive ? 'bg-[#2ecc71]' : 'bg-[#e74c3c]'
                                }`}>
                                {user.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>

                </div>

                {/* ─── PIE DE PÁGINA INFORMATIVO DE LA TARJETA ─── */}
                <div className="pt-6 border-t border-gray-100 flex items-center gap-4 text-xs font-mono text-gray-400">
                    <span>Id: {user.id}</span>
                    <span>Creado: {formatFecha(user.createdDate)}</span>
                </div>
            </div>
        </div>
    );
};