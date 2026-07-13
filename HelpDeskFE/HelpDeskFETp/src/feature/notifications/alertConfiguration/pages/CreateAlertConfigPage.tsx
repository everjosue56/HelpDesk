import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlertConfigurations } from '../hooks/useAlertConfigurations';
import { AlertConfigForm, type AlertConfigFormValues } from '../components/FormAlertConfig';
import { toast } from 'sonner';
import type { CreateAlertConfigurationDto } from '../../../../api/model';

export const CreateAlertConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createConfig } = useAlertConfigurations('', undefined, 1, 5);

  const handleSubmit = async (values: AlertConfigFormValues) => {
  try {
    setIsSubmitting(true);

    const fechaLocal = values.scheduledDate ? `${values.scheduledDate}:00.000Z` : new Date().toISOString();

    const createDto: CreateAlertConfigurationDto = {
      title: values.title.trim(),
      subject: values.subject.trim(),
      description: values.description.trim(),
      isGlobal: values.isGlobal,
      isActive: values.isActive,
      idArea: values.isGlobal ? 0 : (values.idArea ? Number(values.idArea) : 0),
      idAgency: values.isGlobal ? 0 : (values.idAgency ? Number(values.idAgency) : 0),
      scheduledDate: fechaLocal,
    };

    await createConfig(createDto);

    toast.success("Configuración creada exitosamente", {
      description: `La alerta "${values.title}" fue registrada en el servidor central.`,
    });

    navigate('/dashboard/alertconfiguration');
  } catch (error) {
    console.error(error);
    toast.error("No se pudo registrar la configuración de la alerta");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans text-left">
      <div className="flex flex-col gap-0.5">
        <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
          <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
                <span onClick={() => navigate('/dashboard/notifications')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Notificaciones</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span onClick={() => navigate('/dashboard/alertconfiguration')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Configuración de Alertas</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-gray-400 font-semibold">Crear</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Configuración de Alertas</h1>
      </div>

      <AlertConfigForm 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/alertconfiguration')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};