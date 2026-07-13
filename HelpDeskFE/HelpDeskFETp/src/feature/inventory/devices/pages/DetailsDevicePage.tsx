import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDevices } from '../hooks/useDevices';
import { Copy, Edit3, ArrowLeft, Loader2, Laptop } from 'lucide-react';
import { toast } from 'sonner';

export const DetailsDevicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deviceId = Number(id);

  const { device, isFetching, getDeviceById } = useDevices('', 1, 1);

  useEffect(() => {
    if (deviceId) {
      getDeviceById(deviceId);
    }
  }, [deviceId, getDeviceById]);

  // Función interactiva para el botón "Copiar Datos"
  const handleCopyClipboard = async () => {
    if (!device) return;

    const textToCopy = `
      Código Patrimonial: ${device.code}
      Marca/Modelo: ${device.brandName}
      Tipo de Dispositivo: ${device.deviceTypeName}
      Usuario Asignado: ${device.userName}
      Área/Departamento: ${device.areaName}
      Cantidad: ${device.quantity}
      Observaciones: ${device.observation || 'Ninguna'}
      Estado: ${device.isActive ? 'Activo' : 'Inactivo'}
    `.trim().replace(/^[ \t]+/gm, '');

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Ficha técnica copiada al portapapeles");
    } catch (err) {
      console.error("Error al copiar al portapapeles: ", err);
    }
  };

  const formatFecha = (fechaStr?: string) => {
    if (!fechaStr || fechaStr.startsWith('0001-01-01')) return 'No registrada';

    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-HN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(fecha);
  };

  // Estado de carga
  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 animate-fadeIn text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e5f8a]" />
        <p className="text-sm font-medium">Sincronizando ficha técnica de hardware...</p>
      </div>
    );
  }

  // En caso de que el ID no devuelva nada de la base de datos SQL Server
  if (!device) {
    return (
      <div className="p-6 text-center space-y-4 animate-fadeIn">
        <p className="text-gray-500 font-medium">No se encontraron los detalles del dispositivo solicitado.</p>
        <button
          onClick={() => navigate('/dashboard/device')} 
          className="inline-flex items-center gap-2 text-sm text-[#1e5f8a] hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">

      {/* Historial superior (Breadcrumbs de Inventario) */}
      <div className="flex flex-col gap-0.5">
        <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
          <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inventario</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Dispositivos</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-neutral-400 font-semibold">Detalles</span>
        </div>
        <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
          Dispositivos
        </h1>
      </div>

      {/* ─── TARJETA CONTENEDORA PRINCIPAL ─── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8 relative">

        {/* Cabecera Interna: Títulos y Botones de Acción */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700 hidden sm:block">
              <Laptop className="h-6 w-6 text-[#1a558b]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Ficha del Dispositivo</h2>
              <p className="text-sm text-gray-400 mt-0.5">Auditoría técnica y asignación patrimonial</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón Copiar Datos */}
            <button
              onClick={handleCopyClipboard}
              className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#154666] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              Copiar Ficha
            </button>

            {/* Botón Editar Dispositivo */}
            <button
              onClick={() => navigate(`/dashboard/device/edit/${id}`)}
              className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Editar Registro
            </button>
          </div>
        </div>

        {/* ─── GRID DE INFORMACIÓN INTEGRAL ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

          {/* Código Patrimonial */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Código de Inventario</h3>
            <p className="text-sm text-slate-700 font-mono font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg inline-block select-text">
              {device.code}
            </p>
          </div>

          {/* Marca / Modelo */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Marca / Modelo</h3>
            <p className="text-sm text-slate-800 font-bold select-text">{device.brandName}</p>
          </div>

          {/* Tipo de Dispositivo */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Tipo de Dispositivo</h3>
            <p className="text-sm text-gray-500 font-medium">{device.deviceTypeName}</p>
          </div>

          {/* Cantidad */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Cantidad</h3>
            <p className="text-sm text-gray-500 font-medium">{device.quantity} ud.</p>
          </div>

          {/* Usuario Responsable */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Usuario Asignado</h3>
            <p className="text-sm text-gray-500 font-medium select-text">{device.userName}</p>
          </div>

          {/* Área / Departamento */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-600">Área Operativa</h3>
            <p className="text-sm text-gray-500 font-medium">{device.areaName}</p>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-600">Estado Operativo</h3>
            <div>
              <span className={`inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold min-w-32 text-white shadow-sm ${
                device.isActive ? 'bg-[#2ecc71]' : 'bg-[#e74c3c]'
              }`}>
                {device.isActive ? 'Activo / Operativo' : 'Inactivo / Baja'}
              </span>
            </div>
          </div>

          {/* Observaciones Generales */}
          <div className="space-y-1 md:col-span-2 border-t border-slate-50 pt-4">
            <h3 className="text-sm font-bold text-slate-600">Observaciones Técnicas</h3>
            <p className="text-sm text-slate-600 bg-neutral-50 border border-neutral-100 rounded-xl p-4 leading-relaxed whitespace-pre-line select-text">
              {device.observation || 'Sin observaciones registradas para este hardware.'}
            </p>
          </div>

        </div>

        {/* ─── PIE DE PÁGINA DE LA TARJETA ─── */}
        <div className="pt-6 border-t border-gray-100 flex items-center gap-4 text-xs font-mono text-gray-400">
          <span>Id: {device.id}</span>
          <span>Creado: {formatFecha(device.createdDate)}</span>
        </div>
      </div>
    </div>
  );
};