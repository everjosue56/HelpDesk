import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotificationsTable } from '../hooks/useNotificationsTable';
import { Copy, ArrowLeft, Loader2, CheckCircle2, } from 'lucide-react';
import { toast } from 'sonner';

export const DetailsNotificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notificationId = Number(id);

  const {
    notification,
    getNotificationById,
    isFetching,
    markAsRead
  } = useNotificationsTable("", undefined, 1, 1);

  useEffect(() => {
    if (notificationId) {
      getNotificationById(notificationId);
    }
  }, [notificationId, getNotificationById]);

  // Función de copiar datos
  const handleCopyClipboard = async () => {
    if (!notification) return;

    const textToCopy = `
      ID: ${notification.id}
      Usuario Emisor: ${notification.userName}
      Tipo de Alerta: ${notification.alertTypeName}
      Mensaje: ${notification.textMessage}
      Estado: ${notification.isRead ? 'Leída' : 'No Leída'}
      Fecha: ${formatFecha(notification.createdDate)}
    `.trim().replace(/^[ \t]+/gm, '');

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Datos de la notificación copiados");
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
      second: '2-digit',
      hour12: true
    }).format(fecha);
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 animate-fadeIn">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e5f8a]" />
        <p className="text-sm font-medium">Cargando detalles de la notificación...</p>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="p-6 text-center space-y-4 animate-fadeIn">
        <p className="text-gray-500 font-medium">No se encontraron los detalles de la notificación solicitada.</p>
        <button
          onClick={() => navigate('/dashboard/notifications')}
          className="inline-flex items-center gap-2 text-sm text-[#1e5f8a] hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al listado
        </button>
      </div>
    );
  }

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
          <span className="text-neutral-400 font-semibold">Detalles</span>
        </div>
        <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
          Notificaciones
        </h1>
      </div>

      {/* ─── TARJETA CONTENEDORA PRINCIPAL ─── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8 relative">

        {/* Cabecera Interna: Títulos y Botones de Acción */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Detalles de Notificación</h2>
            <p className="text-sm text-gray-400 mt-0.5">Auditoría completa del sistema de alertas</p>
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

            <button
              disabled={notification.isRead}
              onClick={async () => {
                await markAsRead(notification.id);
                toast.success("Notificación marcada como leída");
              }}
              className={`inline-flex items-center justify-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer ${notification.isRead
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-[#1a558b] hover:bg-[#133f67] text-white"
                }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {notification.isRead ? 'Notificación Leída' : 'Marcar como Leída'}
            </button>
          </div>
        </div>

        {/* ─── GRID DE INFORMACIÓN (2 COLUMNAS) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

          {/* Usuario / Emisor */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Usuario Destinatario</h3>
            <p className="text-sm text-gray-500 font-medium">{notification.userName || 'Sistema'}</p>
          </div>

          {/* Tipo de Alerta */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Tipo de Alerta</h3>
            <p className="text-sm text-gray-500 font-medium">{notification.alertTypeName || 'General'}</p>
          </div>

          {/* ID de Referencia */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">ID de Referencia (Entidad)</h3>
            <p className="text-sm text-gray-500 font-mono font-semibold">{notification.idReference || 'N/A'}</p>
          </div>

          {/* Estado de Lectura */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-600">Estado</h3>
            <div>
              <span className={`inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold min-w-32 text-white shadow-sm ${notification.isRead ? 'bg-[#2ecc71]' : 'bg-[#e74c3c]'
                }`}>
                {notification.isRead ? 'Leída' : 'No Leída'}
              </span>
            </div>
          </div>

          {/* Mensaje Completo*/}
          <div className="space-y-1 md:col-span-2 bg-slate-50/50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-slate-600 mb-1">Cuerpo del Mensaje</h3>
            <p className="text-sm text-neutral-700 font-medium leading-relaxed whitespace-pre-wrap">
              {notification.textMessage}
            </p>
          </div>

        </div>

        {/* ─── Footer ─── */}
        <div className="pt-6 border-t border-gray-100 flex items-center gap-4 text-xs font-mono text-gray-400 select-none">
          <span>Id Notificación: {notification.id}</span>
          <span>Id Usuario: {notification.idUser}</span>
          <span>Fecha de Envío: {formatFecha(notification.createdDate)}</span>
        </div>
      </div>
    </div>
  );
};