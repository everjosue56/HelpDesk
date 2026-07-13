import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMaintenances } from '../hooks/useMaintenances';
import { MaintenanceForm, type MaintenanceFormValues } from '../components/MaintenanceForm';
import { toast } from "sonner";

export const CreateMaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  const { createMaintenance, isLoading } = useMaintenances('', 1, 5);

  const handleSubmit = async (values: MaintenanceFormValues) => {
    try {
      await createMaintenance({
        idMaintenanceType: Number(values.idMaintenanceType),
        idArea: Number(values.idArea),
        idDevice: Number(values.idDevice),
        notificationDate: new Date(values.notificationDate).toISOString(),
        completionDate: new Date(values.completionDate).toISOString(),
        details: values.details || "",
        executionTime: Number(values.executionTime)
      });
      
      toast.success("Mantenimiento registrado con éxito", {
        description: "El nuevo registro ha sido añadido al historial del dispositivo.",
      });

      navigate('/dashboard/maintenance');
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar el mantenimiento", {
        description: "Verifique que todos los datos y fechas sean correctos.",
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
          <span onClick={() => navigate('/dashboard/maintenance')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Mantenimiento</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-gray-400 font-semibold">Crear</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Mantenimiento</h1>
      </div>

      <MaintenanceForm 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/maintenance')}
        isSubmitting={isLoading}
      />
    </div>
  );
};