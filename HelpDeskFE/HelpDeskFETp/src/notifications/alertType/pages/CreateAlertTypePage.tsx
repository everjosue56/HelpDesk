import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlertTypes } from '../hooks/useAlertTypes';
import { AlertTypeForm, type AlertTypeFormValues } from '../components/FormAlertTypePage';
import { toast } from 'sonner';
import type { CreateAlertTypeDto } from '../../../api/model';

export const CreateAlertTypePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAlertType } = useAlertTypes('', 1, 5);

  const handleSubmit = async (values: AlertTypeFormValues) => {
    try {
      setIsSubmitting(true);
      const createDto: CreateAlertTypeDto = {
        name: values.name.trim(),
      };
      await createAlertType(createDto);

      toast.success("Tipo de alerta creado exitosamente", {
        description: `La clasificación "${values.name}" ha sido agregada al catálogo.`,
      });

      navigate('/dashboard/alert-types');
    } catch (error) {
      console.error(error);
      toast.error("No se pudo crear el tipo de alerta");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <span className="text-gray-400 font-semibold">Crear</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Tipos de Alertas</h1>
      </div>

      <AlertTypeForm 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/alerttypes')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};