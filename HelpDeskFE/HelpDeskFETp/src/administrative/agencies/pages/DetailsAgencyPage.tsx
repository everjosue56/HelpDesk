import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAgencies } from '../hooks/useAgencies'; // Ajusta la ruta a tu hook
import { Copy, Edit3, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const DetailsAgencyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const agencyId = Number(id);

  // Consumimos el hook inyectando 
  const { agency, isFetching, getAgencyById } = useAgencies('','', 1, 1);

  // Cargar la información de la agencia al montar el componente o cambiar de ID
  useEffect(() => {
    if (agencyId) {
      getAgencyById(agencyId);
    }
  }, [agencyId, getAgencyById]);

  // Función interactiva para el botón "Copiar Datos"
  const handleCopyClipboard = async () => {
    if (!agency) return;

    const textToCopy = `
      Nombre: ${agency.name}
      Organización: ${agency.organizationName}
      Teléfono: ${agency.contact}
      Dirección: ${agency.address}
      Correo: ${agency.email}
      Estado: ${agency.isActive ? 'Activo' : 'Inactivo'}
    `.trim().replace(/^[ \t]+/gm, ''); // Limpia tabulaciones extras

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Datos copiados al portapapeles");
    } catch (err) {
      console.error("Error al copiar al portapapeles: ", err);
    }
  };

  const formatFecha = (fechaStr?: string) => {
    if (!fechaStr) return 'N/A';

    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-HN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(fecha);
  };

  // Estado de carga (Loading) limpio sin parpadeos vacíos
  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 animate-fadeIn">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e5f8a]" />
        <p className="text-sm font-medium">Cargando detalles de la agencia...</p>
      </div>
    );
  }

  // En caso de que el ID no devuelva nada de PostgreSQL
  if (!agency) {
    return (
      <div className="p-6 text-center space-y-4 animate-fadeIn">
        <p className="text-gray-500 font-medium">No se encontraron los detalles de la agencia solicitada.</p>
        <button
          onClick={() => navigate('/administrative/agencies')}
          className="inline-flex items-center gap-2 text-sm text-[#1e5f8a] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn">

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
          <span
            onClick={() => navigate('/dashboard/agencies')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Agencias
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-neutral-400 font-semibold">Detalles</span>
        </div>
        <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
          Agencias
        </h1>
      </div>

      {/* ─── TARJETA CONTENEDORA PRINCIPAL ─── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8 relative">

        {/* Cabecera Interna: Títulos y Botones de Acción */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Detalles de Agencia</h2>
            <p className="text-sm text-gray-400 mt-0.5">Detalles de Agencia Seleccionada</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón Copiar Datos */}
            <button
              onClick={handleCopyClipboard}
              className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Copy className="h-3.5 w-3.5" />
              Copiar Datos
            </button>

            {/* Botón Editar Agencia */}
            <button
              onClick={() => navigate(`/dashboard/agencies/edit/${id}`)}
              className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Editar Agencia
            </button>
          </div>
        </div>

        {/* ─── GRID DE INFORMACIÓN (2 COLUMNAS) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

          {/* Nombre de la Agencia */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Nombre</h3>
            <p className="text-sm text-gray-500 font-medium">{agency.name}</p>
          </div>

          {/* Nombre de la Organización */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Nombre Organizacion</h3>
            <p className="text-sm text-gray-500 font-medium">{agency.organizationName || 'N/A'}</p>
          </div>

          {/* Teléfono / Contacto */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Telefono</h3>
            <p className="text-sm text-gray-500 font-medium">{agency.contact || 'N/A'}</p>
          </div>

          {/* Dirección */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Direccion</h3>
            <p className="text-sm text-gray-500 font-medium">{agency.address || 'N/A'}</p>
          </div>

          {/* Correo Electrónico */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Correo Electronico</h3>
            <p className="text-sm text-[#1e5f8a] font-medium underline break-all">
              {agency.email || 'N/A'}
            </p>
          </div>

          {/* Estado (Badge Dinámico) */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-600">Estado</h3>
            <div>
              <span className={`inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold min-w-32 text-white shadow-sm ${agency.isActive ? 'bg-[#2ecc71]' : 'bg-[#e74c3c]'
                }`}>
                {agency.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

        </div>

        {/* ─── PIE DE PÁGINA DE LA TARJETA ─── */}
        <div className="pt-6 border-t border-gray-100 flex items-center gap-4 text-xs font-mono text-gray-400">
          <span>Id: {agency.id}</span>
          <span>Creado: {formatFecha(agency.createdDate)}</span>
        </div>
      </div>
    </div>
  );
};