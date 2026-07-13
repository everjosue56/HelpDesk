import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlertConfigurations } from '../hooks/useAlertConfigurations'; 
import { Copy, Edit3, ArrowLeft, Loader2, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const DetailsAlertConfigPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const configId = Number(id);

  const { configDetail, isFetching, getConfigById } = useAlertConfigurations('', undefined, 1, 1);

  useEffect(() => {
    if (configId) {
      getConfigById(configId);
    }
  }, [configId, getConfigById]);

  // Función "Copiar Datos"
  const handleCopyClipboard = async () => {
    if (!configDetail) return;

    const textToCopy = `
      Título: ${configDetail.title}
      Asunto: ${configDetail.subject}
      Descripción: ${configDetail.description}
      Alcance: ${configDetail.isGlobal ? 'Global' : 'Específico'}
      Agencia: ${configDetail.agencyName}
      Área: ${configDetail.areaName}
      Fecha Programada: ${formatFecha(configDetail.scheduledDate)}
      Estado: ${configDetail.isActive ? 'Activo' : 'Inactivo'}
    `.trim().replace(/^[ \t]+/gm, '');

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Configuración copiada al portapapeles");
    } catch (err) {
      console.error("Error al copiar al portapapeles: ", err);
    }
  };

  const formatFecha = (fechaStr?: string) => {
    if (!fechaStr || fechaStr === 'N/A') return 'N/A';

    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-HN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(fecha);
  };

  // Estado de carga (Loading)  
  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 animate-fadeIn">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e5f8a]" />
        <p className="text-sm font-medium">Cargando detalles de la alerta...</p>
      </div>
    );
  }

  if (!configDetail) {
    return (
      <div className="p-6 text-center space-y-4 animate-fadeIn">
        <p className="text-gray-500 font-medium">No se encontraron los detalles de la configuración solicitada.</p>
        <button
          onClick={() => navigate('/dashboard/alertconfiguration')}
          className="inline-flex items-center gap-2 text-sm text-[#1e5f8a] hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al listado
        </button>
      </div>
    );
  }

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
            onClick={() => navigate('/dashboard/notifications')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Notificaciones
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span
            onClick={() => navigate('/dashboard/alertconfiguration')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Configuración de Alertas
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-neutral-400 font-semibold">Detalles</span>
        </div>
        <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
          Configuración de Alertas
        </h1>
      </div>

      {/* ─── TARJETA CONTENEDORA PRINCIPAL ─── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8 relative">

        {/* Cabecera Interna: Títulos y Botones de Acción */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Detalles de la Alerta</h2>
            <p className="text-sm text-gray-400 mt-0.5">Auditoría de automatización de notificaciones</p>
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

            {/* Botón Editar Configuración */}
            <button
              onClick={() => navigate(`/dashboard/alertconfiguration/edit/${id}`)}
              className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Editar Configuración
            </button>
          </div>
        </div>

        {/* ─── GRID DE INFORMACIÓN (2 COLUMNAS) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

          {/* Título de la Alerta */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Título de la Alerta</h3>
            <p className="text-sm text-gray-500 font-medium">{configDetail.title}</p>
          </div>

          {/* Asunto del Correo */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Asunto del Mensaje</h3>
            <p className="text-sm text-gray-500 font-medium">{configDetail.subject}</p>
          </div>

          {/* Alcance (Badge Dinámico) */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Alcance de Distribución</h3>
            <div className="pt-0.5">
              {configDetail.isGlobal ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">
                  <Globe className="h-3.5 w-3.5" /> Global (Toda la Organización)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                  <Lock className="h-3.5 w-3.5" /> Específico (Segmentado)
                </span>
              )}
            </div>
          </div>

          {/* Fecha Programada de Ejecución */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Fecha y Hora Programada</h3>
            <p className="text-sm text-gray-500 font-medium font-mono">{formatFecha(configDetail.scheduledDate)}</p>
          </div>

          {/* Nombre de la Agencia Destino */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Agencia Destino</h3>
            <p className="text-sm text-gray-500 font-medium">{configDetail.agencyName || 'Global / No Aplica'}</p>
          </div>

          {/* Nombre del Área Destino */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Área Técnica Destino</h3>
            <p className="text-sm text-gray-500 font-medium">{configDetail.areaName || 'Global / No Aplica'}</p>
          </div>

          {/* Estado de la Alerta (Badge Dinámico) */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-600">Estado Operativo</h3>
            <div>
              <span className={`inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold min-w-32 text-white shadow-sm ${
                configDetail.isActive ? 'bg-[#2ecc71]' : 'bg-[#e74c3c]'
              }`}>
                {configDetail.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          {/* Cuerpo del Mensaje Completo */}
          <div className="space-y-1 md:col-span-2 bg-slate-50/50 p-5 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-bold text-slate-600 mb-1">Descripción / Cuerpo del Mensaje</h3>
            <p className="text-sm text-neutral-700 font-medium leading-relaxed whitespace-pre-wrap">
              {configDetail.description}
            </p>
          </div>

        </div>

        {/* ─── PIE DE PÁGINA DE LA TARJETA ─── */}
        <div className="pt-6 border-t border-gray-100 flex items-center gap-4 text-xs font-mono text-gray-400 select-none">
          <span>Id Configuración: {configDetail.id}</span>
          <span>Id Área: {configDetail.idArea ?? 'N/A'}</span>
          <span>Id Agencia: {configDetail.idAgency ?? 'N/A'}</span>
          <span>Fecha de Creación: {formatFecha(configDetail.createdDate)}</span>
        </div>
      </div>
    </div>
  );
};