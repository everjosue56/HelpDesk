import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypeDevices } from '../hooks/useTypeDevices';
import { TypeDeviceForm, type TypeDeviceFormValues } from '../components/TypeDeviceForm';
import { toast } from "sonner";

export const CreateTypeDevicePage: React.FC = () => {
  const navigate = useNavigate();
  
  const { createTypeDevice, isLoading } = useTypeDevices('', 1, 5);

  const handleSubmit = async (values: TypeDeviceFormValues) => {
    try {
      await createTypeDevice({ 
        name: values.name,    
        description: values.description, 
      });
      
      toast.success("Tipo de dispositivo registrado exitosamente", {
        description: `La clasificación "${values.name}" ha sido guardada en el sistema.`,
      });

      navigate('/dashboard/typedevice');
    } catch (error) {
      console.error(error);
      toast.error("No se pudo registrar el tipo de dispositivo", {
        description: "Hubo un problema con el servidor al procesar la solicitud.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">
      
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
          <span className="text-gray-400 font-semibold">Crear</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          Tipo de Dispositivo
        </h1>
      </div>

      {/* Formulario */}
      <TypeDeviceForm 
        initialData={undefined} 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/typedevice')}
        isSubmitting={isLoading}
      />
    </div>
  );
};