import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTypeDevices } from '../hooks/useTypeDevices';
import { TypeDeviceForm, type TypeDeviceFormValues } from '../components/TypeDeviceForm';
import { toast } from "sonner";

export const EditTypeDevicePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 

  const { getTypeDeviceById, updateTypeDevice, isLoading } = useTypeDevices('', 1, 5);

  const [deviceData, setDeviceData] = useState<TypeDeviceFormValues & { id: number } | null>(null);
  const [isFetchingData, setIsFetchingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setIsFetchingData(true);
        const result = await getTypeDeviceById(Number(id));
        
        if (result) {
          setDeviceData({
            id: result.id,
            name: result.name,
            description: result.description,
          });
        } else {
          toast.error("No se encontró el registro solicitado");
          navigate('/dashboard/typedevice');
        }
      } catch (error) {
        console.error("Error cargando el tipo de dispositivo para edición:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    loadData();
  }, [id, getTypeDeviceById, navigate]);

  const handleSubmit = async (values: TypeDeviceFormValues) => {
    if (!id) return;
    try {
      await updateTypeDevice(Number(id), {
        name: values.name,
        description: values.description,
      });

      toast.success("Tipo de dispositivo actualizado correctamente", {
        description: `Los cambios en "${values.name}" han sido guardados con éxito.`,
      });

      navigate('/dashboard/typedevice');
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron guardar los cambios", {
        description: "Hubo un inconveniente en el servidor al actualizar el registro.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">
      
      {/* Historial superior ) */}
      <div className="flex flex-col gap-0.5">
        <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
          <span
            onClick={() => navigate('/dashboard')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Inicio
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span
            onClick={() => navigate('/dashboard/device')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Inventario
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span
            onClick={() => navigate('/dashboard/typedevice')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Tipo de Dispositivo
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-gray-400 font-semibold">Editar</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          Tipo de Dispositivo
        </h1>
      </div>

      {/* ─── RENDERIZADO ─── */}
      {isFetchingData ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-medium text-gray-400 animate-pulse">
          Sincronizando ficha técnica con el servidor...
        </div>
      ) : (
        <TypeDeviceForm 
          initialData={deviceData} 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/typedevice')}
          isSubmitting={isLoading}
        />
      )}
    </div>
  );
};