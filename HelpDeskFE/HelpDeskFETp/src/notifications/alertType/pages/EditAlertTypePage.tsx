import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlertTypes } from '../hooks/useAlertTypes';
import { AlertTypeForm, type AlertTypeFormValues } from '../components/FormAlertTypePage';
import { toast } from 'sonner';
import type { UpdateAlertTypeDto } from '../../../api/model';

export const EditAlertTypePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const typeId = Number(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { alertTypeDetail, getAlertTypeById, updateAlertType, isFetching } = useAlertTypes('', 1, 5);

  useEffect(() => {
    if (typeId) {
      getAlertTypeById(typeId);
    }
  }, [typeId, getAlertTypeById]);

  const handleSubmit = async (values: AlertTypeFormValues) => {
    try {
      setIsSubmitting(true);
      const updateDto: UpdateAlertTypeDto = {
        name: values.name.trim(),
      };
      await updateAlertType(typeId, updateDto);

      toast.success("Tipo de alerta actualizado exitosamente", {
        description: `La clasificación "${values.name}" ha sido modificada en el catálogo.`,
      });

      navigate('/dashboard/alerttypes');
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el tipo de alerta");
    } {
      setIsSubmitting(false);
    }
  };

  if (isFetching && !alertTypeDetail) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-sm font-medium text-gray-400 animate-pulse m-6">
        Recuperando la configuración de la alerta desde el servidor...
      </div>
    );
  }

  return (
       <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">
      <div className="flex flex-col gap-0.5">
        <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
          <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span onClick={() => navigate('/dashboard/notifications')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Notificaciones</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span onClick={() => navigate('/dashboard/alerttypes')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Tipos de Alerta</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-gray-400 font-semibold">Editar</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Tipos de Alertas</h1>
      </div>

      <AlertTypeForm 
        initialData={alertTypeDetail} 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/alerttypes')}
        isSubmitting={isSubmitting || isFetching}
      />
    </div>
  );
};