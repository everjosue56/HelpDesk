import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTypeMaintenance } from '../hooks/useTypeMaintenance';
import { TypeMaintenanceForm, type TypeMaintenanceFormValues } from '../components/TypeMaintenanceForm';
import { toast } from "sonner";

export const EditTypeMaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { getTypeMaintenanceById, updateTypeMaintenance, isLoading } = useTypeMaintenance('', 1, 5);
  
  const [maintenanceData, setMaintenanceData] = useState<TypeMaintenanceFormValues & { id: number } | null>(null);
  const [isFetchingData, setIsFetchingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setIsFetchingData(true);
        const result = await getTypeMaintenanceById(Number(id));
        
        if (result) {
          setMaintenanceData({
            id: result.id,
            name: result.name,
            estimatedTime: result.estimatedTime
          });
        } else {
          toast.error("No se encontró el registro solicitado");
          navigate('/dashboard/typemaintenance');
        }
      } catch (error) {
        console.error("Error cargando el tipo de mantenimiento para edición:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    loadData();
  }, [id, getTypeMaintenanceById, navigate]);

  const handleSubmit = async (values: TypeMaintenanceFormValues) => {
    if (!id) return;
    try {
      await updateTypeMaintenance(Number(id), {
        name: values.name,
        estimatedTime: Number(values.estimatedTime)
      });

      toast.success("Tipo de mantenimiento actualizado", {
        description: `Los cambios en "${values.name}" han sido guardados con éxito.`,
      });

      navigate('/dashboard/typemaintenance');
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron guardar los cambios", {
        description: "Hubo un inconveniente en el servidor al actualizar el registro.",
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
          <span onClick={() => navigate('/dashboard/typemaintenance')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Tipo Mantenimiento</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-gray-400 font-semibold">Editar</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          Tipo Mantenimiento
        </h1>
      </div>

      {isFetchingData ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-medium text-gray-400 animate-pulse">
          Sincronizando ficha con el servidor...
        </div>
      ) : (
        <TypeMaintenanceForm 
          initialData={maintenanceData} 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/typemaintenance')}
          isSubmitting={isLoading}
        />
      )}
    </div>
  );
};