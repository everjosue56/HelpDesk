import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevices } from '../hooks/useDevices';
import { DeviceForm, type DeviceFormValues } from '../components/DeviceForm';
import { toast } from "sonner";

export const CreateDevicePage: React.FC = () => {
  const navigate = useNavigate();
  const { createDevice, isLoading } = useDevices('', 1, 5);

  const handleSubmit = async (values: DeviceFormValues) => {
    try {
      await createDevice({
        code: values.code,
        brandName: values.brandName,
        quantity: Number(values.quantity),
        idDeviceType: Number(values.idDeviceType),
        idUser: Number(values.idUser),
        idArea: Number(values.idArea),
        observation: values.observation || "",
        isActive: values.isActive
      });
      
      toast.success("Dispositivo incorporado con éxito", {
        description: `El equipo "${values.brandName}" ha sido codificado en el inventario.`,
      });

      navigate('/dashboard/device');
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar dispositivo", {
        description: "Asegúrese que el código patrimonial no se encuentre duplicado.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">
      
      {/* Breadcrumbs */}
      <div className="flex flex-col gap-0.5">
        <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
          <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inventario</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Dispositivos</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-gray-400 font-semibold">Crear</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Dispositivos</h1>
      </div>

      <DeviceForm 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/device')}
        isSubmitting={isLoading}
      />
    </div>
  );
};