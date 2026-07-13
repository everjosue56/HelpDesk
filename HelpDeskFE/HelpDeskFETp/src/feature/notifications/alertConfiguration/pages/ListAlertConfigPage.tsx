import React, { useState } from 'react';
import { useAlertConfigurations, type AlertConfigItem } from '../hooks/useAlertConfigurations';
import {
  Search,
  Eye,
  Trash2,
  X,
  Plus,
  Globe,
  Lock,
  Edit,
  BellRing
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../../../@/components/ui/pagination';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../@/components/ui/select';
import { toast } from 'sonner';
import { AlertConfigDeleteModal } from '../components/AlertConfigDeleteModal';

export const ListAlertConfigPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const {
    configurations,
    totalCount,
    isLoading,
    toggleConfigStatus,
    deleteConfig,
  } = useAlertConfigurations(searchTerm, isActiveFilter, page, pageSize);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const navigate = useNavigate();

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

  const [selectedAlertConfig, setSelectedAlertConfig] = useState<AlertConfigItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async (id: number) => {
      try {
        await deleteConfig(id);
        toast.success("Configuración eliminada correctamente");
      } catch (error) {
        console.log(error)
        toast.error("Error al eliminar la configuración");
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

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

      {/* Historial superior */}
      <div className="flex flex-col gap-0.5 select-none">
        <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
          <span
            onClick={() => navigate('/dashboard')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Inicio
          </span>
            <span className="text-neutral-300 font-normal">&gt;</span>
          <span
            onClick={() => navigate('/dashboard/notifications')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Notificaciones
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-neutral-400 font-semibold">Configuración de Alertas</span>
        </div>
        <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
          Configuración de Alertas
        </h1>
      </div>

         {/* ─── CONTENEDOR DE KPIS ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* KPI Total alerta  */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Total Configuracion de Alertas</p>
                        <p className="text-3xl font-bold text-slate-800">
                            {totalCount ?? 0}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
                        <BellRing className="h-6 w-6 text-slate-600" />
                    </div>
                </div>
            </div>

      {/* ─── TARJETA CONTENEDORA  ─── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Lista de Configuraciones</h2>
            <p className="text-xs text-gray-400">Automatiza y gestiona las alertas programadas del HelpDesk</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
              onClick={() => navigate('create')}
            >
              <Plus className="h-4 w-4" />
              Nueva Alerta
            </button>
          </div>
        </div>

        {/* ─── BARRA DE FILTROS ─── */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">

          {/* Input de Búsqueda */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Selector de Estado */}
          <div className="flex items-center gap-2 w-full sm:max-w-xs">
            <Select
              onValueChange={(val) => {
                if (val === "true") setIsActiveFilter(true);
                else if (val === "false") setIsActiveFilter(false);
                else setIsActiveFilter(undefined);
                setPage(1);
              }}
              value={isActiveFilter === undefined ? "all" : String(isActiveFilter)}
            >
              <SelectTrigger className="rounded-xl border-gray-200 h-9.5 pl-4 pr-3 text-sm text-slate-700 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] w-full bg-white select-none shadow-none">
                <SelectValue placeholder="Filtrar por Estado" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl border border-gray-200 select-none">
                <SelectItem value="all" className="cursor-pointer text-sm">Todos los estados</SelectItem>
                <SelectItem value="true" className="cursor-pointer text-sm">Activas</SelectItem>
                <SelectItem value="false" className="cursor-pointer text-sm">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ─── TABLA DE CONFIGURACIONES DE ALERTA ─── */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#eef2f5] text-slate-600 font-semibold border-b border-gray-200 select-none">
                <th className="p-3 w-16">No.</th>
                <th className="p-3 w-64">Título / Asunto</th>
                <th className="p-3 w-40">Alcance</th>
                <th className="p-3 w-44">Agencia / Área</th>
                <th className="p-3 w-32 text-center">F. Ejecución</th>
                <th className="p-3 w-28 text-center">Estado</th>
                <th className="p-3 w-28 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-100 text-slate-700 transition-opacity duration-200 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
              }`}>
              {isLoading && configurations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 animate-pulse">
                    Cargando configuraciones de alertas...
                  </td>
                </tr>
              ) : configurations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No se encontraron configuraciones de alertas registradas.
                  </td>
                </tr>
              ) : (
                configurations.map((config, index) => {
                  const itemNumber = (page - 1) * pageSize + index + 1;
                  return (
                    <tr key={config.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono text-gray-400 text-xs font-semibold">
                        {itemNumber}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 truncate max-w-60" title={config.title}>
                            {config.title}
                          </span>
                          <span className="text text-neutral-400 truncate max-w-60" title={config.subject}>
                            {config.subject}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        {config.isGlobal ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                            <Globe className="h-3.5 w-3.5" /> Global
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                            <Lock className="h-3.5 w-3.5" /> Específico
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="text-slate-700 font-medium"><span className="text-neutral-400 font-normal">Agencia:</span> {config.agencyName}</span>
                          <span className="text-slate-500"><span className="text-neutral-400 font-normal">Área:</span> {config.areaName}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center text-gray-500">
                        {formatFecha(config.scheduledDate)}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center">
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={config.isActive}
                              onChange={() => toggleConfigStatus(config.id, config)}
                              className="sr-only peer"
                            />
                            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e5f8a]"></div>
                          </label>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-3 text-gray-400">
                          <button
                            className="hover:text-slate-600 transition-colors cursor-pointer"
                            title="Ver detalle"
                            onClick={() => navigate(`details/${config.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="hover:text-[#1a558b] transition-colors cursor-pointer"
                            title="Editar"
                            onClick={() => navigate(`edit/${config.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="hover:text-red-500 transition-colors cursor-pointer"
                            title="Eliminar"
                              onClick={() => { setSelectedAlertConfig(config); setIsDeleteOpen(true); }}
                          >
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

        {/* ─── PAGINACIÓN  ─── */}
        {totalPages > 1 && (
          <div className="pt-4 flex justify-center select-none">
            <Pagination>
              <PaginationContent className="text-xs font-bold text-neutral-500 gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={handlePrevious}
                    className={`rounded-lg h-8 px-2.5 text-xs font-bold transition-colors cursor-pointer ${page === 1 ? "pointer-events-none opacity-40" : "hover:bg-slate-50 text-neutral-600"}`}
                  />
                </PaginationItem>

                {(() => {
                  const pages: (number | string)[] = [];
                  if (totalPages <= 5) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    pages.push(2);
                    if (page > 4) pages.push("...");
                    for (let i = Math.max(3, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                      if (!pages.includes(i)) pages.push(i);
                    }
                    if (page < totalPages - 2 && !pages.includes("...")) pages.push("...");
                    if (!pages.includes(totalPages)) pages.push(totalPages);
                  }

                  return pages.map((pageItem, index) => {
                    if (pageItem === "...") {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <span className="w-8 h-8 flex items-center justify-center text-xs text-neutral-400 font-medium">...</span>
                        </PaginationItem>
                      );
                    }
                    const pageNum = pageItem as number;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => handlePageClick(e, pageNum)}
                          isActive={page === pageNum}
                          className={`rounded-lg w-8 h-8 text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${page === pageNum ? "bg-[#1a558b] text-white" : "hover:bg-slate-50 text-neutral-600"}`}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  });
                })()}

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
      <AlertConfigDeleteModal
        isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelectedAlertConfig(null); }} onConfirm={handleDelete} config={selectedAlertConfig}
      />
    </div>
  );
};