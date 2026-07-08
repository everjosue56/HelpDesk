import React, { useState } from 'react';
import { useAlertTypes, type AlertTypeItem } from '../hooks/useAlertTypes';
import { Search, Trash2, X, Plus, Edit, AlertCircle } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../../@/components/ui/pagination';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertTypeDeleteModal } from '../components/AlertTypeDeleteModal';

export const AlertTypesListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const {
    alertTypes,
    totalCount,
    isLoading,
    refresh,
    deleteAlertType,
  } = useAlertTypes(searchTerm, page, pageSize);

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

  const [selectedTypeAlert, setSelectedTypeAlert] = useState<AlertTypeItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async (id: number) => {
    try {
      await deleteAlertType(id);
      toast.success("Tipo de alerta desactivado correctamente");
      refresh();
    } catch (error) {
      toast.error("Error al procesar la desactivación");
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

      {/* Breadcrumbs */}
      <div className="flex flex-col gap-0.5 select-none">
        <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
          <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">
            Inicio
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span onClick={() => navigate('/dashboard/notifications')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">
            Notificaciones
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-neutral-400 font-semibold">Tipos de Alerta</span>
        </div>
        <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
          Tipos de Alerta
        </h1>
      </div>

      {/* ─── CONTENEDOR DE KPI  ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KPI Total Agencias */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Total Agencias</p>
            <p className="text-3xl font-bold text-slate-800">
              {totalCount ?? 0}
            </p>
          </div>
          <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
            <AlertCircle className="h-6 w-6 text-slate-600" />
          </div>
        </div>
      </div>
      {/* Contenedor Principal */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">

        {/* Encabezado de la Tabla */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Catálogo de Tipos</h2>
            <p className="text-xs text-gray-400">Clasificación base de los disparadores del módulo de notificaciones</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
              onClick={() => navigate('create')}
            >
              <Plus className="h-4 w-4" />
              Nuevo Tipo
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tipo de alerta..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#eef2f5] text-slate-600 font-semibold border-b border-gray-200 select-none">
                <th className="p-3 w-20">No.</th>
                <th className="p-3">Nombre del Tipo de Alerta</th>
                <th className="p-3 w-32 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-100 text-slate-700 transition-opacity duration-200 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
              }`}>
              {isLoading && alertTypes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400 animate-pulse">
                    Cargando catálogo...
                  </td>
                </tr>
              ) : alertTypes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400">
                    No se encontraron tipos de alerta registrados.
                  </td>
                </tr>
              ) : (
                alertTypes.map((type, index) => {
                  const itemNumber = (page - 1) * pageSize + index + 1;
                  return (
                    <tr key={type.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono text-gray-400 text-xs font-semibold">
                        {itemNumber}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">
                        {type.name}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-4 text-gray-400">
                          <button
                            className="hover:text-[#1a558b] transition-colors cursor-pointer"
                            title="Editar"
                            onClick={() => navigate(`edit/${type.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="hover:text-red-500 transition-colors cursor-pointer"
                            title="Eliminar"
                            onClick={() => { setSelectedTypeAlert(type); setIsDeleteOpen(true); }}
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

        {/* Paginación */}
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
      <AlertTypeDeleteModal
        isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelectedTypeAlert(null); }} onConfirm={handleDelete} alertType={selectedTypeAlert}
      />
    </div>
  );
};