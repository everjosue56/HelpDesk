import { useNotificationsTable } from '../hooks/useNotificationsTable';
import {
    Search,
    Eye,
    Trash2,
    X,
    Bell,
    RefreshCw
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../@/components/ui/pagination';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../@/components/ui/select';

export const NotificationsListPage: React.FC = () => {
    const pageSize = 5; // Manteniendo el tamaño de filas de tu diseño original
    const {
        notifications,
        totalCount,
        isLoading,
        page,
        setPage,
        keyword,
        setKeyword,
        setIsReadFilter,
        toggleReadStatus,
        refresh
    } = useNotificationsTable(pageSize);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const navigate = useNavigate();

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePageClick = (e: React.MouseEvent, pageNumber: number) => {
        e.preventDefault();
        setPage(pageNumber);
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

            {/* Historial superior (Breadcrumbs) */}
            <div className="flex flex-col gap-0.5 select-none">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
                    <span
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                    >
                        Inicio
                    </span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-neutral-400 font-semibold">Notificaciones</span>
                </div>
                <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
                    Notificaciones
                </h1>
            </div>

            {/* ─── CONTENEDOR DE KPIS (ANTIPARPADEO CLONADO) ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Notificaciones</p>
                        <p className="text-3xl font-bold text-slate-800">
                            {totalCount ?? 0}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
                        <Bell className="h-6 w-6 text-slate-600" />
                    </div>
                </div>
            </div>

            {/* ─── CONTENEDOR PRINCIPAL DEL LISTADO TIPO TABLA ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

                {/* Fila del Título y Botón de Sincronización */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Lista de Notificaciones</h2>
                        <p className="text-xs text-gray-400">Gestiona todas las notificaciones registradas en el sistema</p>
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60 font-medium text-sm px-4 py-2.5 rounded-xl transition-colors shadow-none cursor-pointer"
                        onClick={refresh}
                    >
                        <RefreshCw className="h-4 w-4" />
                        Sincronizar
                    </button>
                </div>

                {/* ─── CONTENEDOR DE FILTROS INTERACTIVOS EN FILA ─── */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">

                    {/* Barra de Búsqueda por Mensaje */}
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por descripción..."
                            value={keyword}
                            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
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

                    {/* Selector de Estado de Lectura */}
                    <div className="flex items-center gap-2 w-full sm:max-w-xs">
                        <Select
                            onValueChange={(val) => {
                                if (val === "true") setIsReadFilter(true);
                                else if (val === "false") setIsReadFilter(false);
                                else setIsReadFilter(undefined);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full bg-white select-none shadow-none">
                                <SelectValue placeholder="Filtrar por Lectura" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                                <SelectItem value="all" className="cursor-pointer text-sm">Todas</SelectItem>
                                <SelectItem value="true" className="cursor-pointer text-sm">Leídas</SelectItem>
                                <SelectItem value="false" className="cursor-pointer text-sm">No Leídas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                {/* ─── TABLA DE DATOS FORMAL ─── */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#eef2f5] text-slate-600 font-semibold border-b border-gray-200 select-none">
                                <th className="p-3 w-16">No.</th>
                                <th className="p-3 w-40">Emisor</th>
                                <th className="p-3 w-40">Tipo de Alerta</th>
                                <th className="p-3">Mensaje</th>
                                <th className="p-3 w-40 text-center">Estado / Leer</th>
                                <th className="p-3 w-28 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-gray-100 text-slate-700 transition-opacity duration-200 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
                            }`}>
                            {isLoading && notifications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400 animate-pulse">
                                        Cargando alertas del sistema...
                                    </td>
                                </tr>
                            ) : notifications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        No se encontraron notificaciones registradas.
                                    </td>
                                </tr>
                            ) : (
                                notifications.map((notif, index) => {
                                    const itemNumber = (page - 1) * pageSize + index + 1;
                                    return (
                                        <tr key={notif.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3 font-mono text-gray-400 text-xs font-semibold">
                                                {String(itemNumber).padStart(3, '0')}
                                            </td>
                                            <td className="p-3 font-bold text-slate-800">
                                                {notif.userName || 'Sistema'}
                                            </td>
                                            <td className="p-3 text-gray-500">
                                                {notif.alertTypeName || 'In-App'}
                                            </td>
                                            <td className="p-3 text-gray-500 max-w-xs truncate" title={notif.textMessage}>
                                                {notif.textMessage}
                                            </td>
                                            <td className="p-3 text-center">
                                                {/* Toggle Switch formal de Shadcn / Tailwind */}
                                                <label className="relative inline-flex items-center cursor-pointer select-none mx-auto">
                                                    <input
                                                        type="checkbox"
                                                        checked={notif.isRead}
                                                        onChange={() => toggleReadStatus(notif.id, notif.isRead)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e5f8a]"></div>
                                                </label>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                                    <button className="hover:text-slate-600 transition-colors cursor-pointer" title="Ver detalle">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="hover:text-red-500 transition-colors cursor-pointer" title="Eliminar">
                                                        <Trash2 className="h-4 w-4" />  
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

                {/* ─── PAGINACIÓN INDEXADA REUTILIZADA ─── */}
                <div className="pt-4 flex justify-center select-none">
                    <Pagination>
                        <PaginationContent className="text-xs font-bold text-neutral-500 gap-1">
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

                            {Array.from({ length: totalPages }, (_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => handlePageClick(e, pageNumber)}
                                            isActive={page === pageNumber}
                                            className={`rounded-lg w-8 h-8 text-xs font-bold transition-all flex items-all justify-center cursor-pointer ${page === pageNumber
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
                                    className={`rounded-lg h-8 px-2.5 text-xs font-bold transition-colors cursor-pointer ${page === totalPages
                                        ? "pointer-events-none opacity-40 select-none"
                                        : "hover:bg-slate-50 text-neutral-600"
                                        }`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

            </div>
        </div>
    );
};