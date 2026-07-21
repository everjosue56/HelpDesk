import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMaintenances } from '../hooks/useMaintenances';
import { MaintenanceForm, type MaintenanceFormValues } from '../components/MaintenanceForm';
import { toast } from "sonner";

export const EditMaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { getMaintenanceById, updateMaintenance, isLoading } = useMaintenances('', 1, 5);
  
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceFormValues & { id: number } | null>(null);
  const [isFetchingData, setIsFetchingData] = useState(true);

  useEffect(() => {
    const loadMaintenance = async () => {
      if (!id) return;
      try {
        setIsFetchingData(true);
        const result = await getMaintenanceById(Number(id));
        
        if (result) {
          setMaintenanceData({
            id: result.id,
            idMaintenanceType: result.idMaintenanceType,
            idArea: result.idArea,
            idDevice: result.idDevice,
            idMaintenanceFrequency: result.idMaintenanceFrequency,
            notificationDate: result.notificationDate,
            completionDate: result.completionDate,
            details: result.details,
            executionTime: result.executionTime
          });
        } else {
          toast.error("No se localizó el registro solicitado");
          navigate('/dashboard/maintenance');
        }
      } catch (error) {
        console.error("Error al cargar mantenimiento para actualización:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    loadMaintenance();
  }, [id, getMaintenanceById, navigate]);

  const handleSubmit = async (values: MaintenanceFormValues) => {
    if (!id) return;
    try {
      await updateMaintenance(Number(id), {
        idMaintenanceType: Number(values.idMaintenanceType),
        idArea: Number(values.idArea),
        idDevice: Number(values.idDevice),
        idMaintenanceFrequency: Number(values.idMaintenanceFrequency ?? 0),
        notificationDate: new Date(values.notificationDate).toISOString(),
        completionDate: new Date(values.completionDate).toISOString(),
        details: values.details || "",
        executionTime: Number(values.executionTime)
      });

      toast.success("Registro actualizado exitosamente");
      navigate('/dashboard/maintenance');
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar cambios en el mantenimiento");
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
          <span className="text-gray-400 font-semibold">Editar</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Mantenimiento</h1>
      </div>

      {isFetchingData ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-medium text-gray-400 animate-pulse">
          Sincronizando ficha con la base de datos...
        </div>
      ) : (
        <MaintenanceForm 
          initialData={maintenanceData} 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/maintenance')}
          isSubmitting={isLoading}
        />
      )}
    </div>
  );
};