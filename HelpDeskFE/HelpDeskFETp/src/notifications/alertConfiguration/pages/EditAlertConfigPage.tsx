import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlertConfigurations } from '../hooks/useAlertConfigurations';
import { AlertConfigForm, type AlertConfigFormValues } from '../components/FormAlertConfig';
import { toast } from 'sonner';
import type { UpdateAlertConfigurationDto } from '../../../api/model';

export const EditAlertConfigPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const configId = Number(id);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { configDetail, getConfigById, updateConfig, isFetching } = useAlertConfigurations('', undefined, 1, 5);

    useEffect(() => {
        if (configId) {
            getConfigById(configId);
        }
    }, [configId, getConfigById]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapBackendToForm = (detail: any): any => {
        if (!detail) return null;
        return {
            id: detail.id,
            title: detail.title,
            subject: detail.subject,
            description: detail.description,
            isGlobal: detail.isGlobal,
            isActive: detail.isActive,
            idArea: detail.idArea,
            idAgency: detail.idAgency,
            scheduledDate: detail.scheduledDate ? detail.scheduledDate.slice(0, 16) : '',
        };
    };

    const handleSubmit = async (values: AlertConfigFormValues) => {
        try {
            setIsSubmitting(true);

            const fechaLocal = values.scheduledDate ? `${values.scheduledDate}:00.000Z` : new Date().toISOString();

            const updateDto: UpdateAlertConfigurationDto = {
                title: values.title.trim(),
                subject: values.subject.trim(),
                description: values.description.trim(),
                isGlobal: values.isGlobal,
                isActive: values.isActive,
                idArea: values.isGlobal ? 0 : (values.idArea ? Number(values.idArea) : 0),
                idAgency: values.isGlobal ? 0 : (values.idAgency ? Number(values.idAgency) : 0),
                scheduledDate: fechaLocal,
            };

            await updateConfig(configId, updateDto);

            toast.success("Configuración modificada exitosamente", {
                description: `Los cambios en la alerta "${values.title}" fueron actualizados en el servidor.`,
            });

            navigate('/dashboard/alertconfiguration');
        } catch (error) {
            console.error(error);
            toast.error("No se pudo actualizar la configuración de alerta");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFetching && !configDetail) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-sm font-medium text-gray-400 animate-pulse m-6">
                Recuperando los parámetros de la alerta desde el servidor...
            </div>
        );
    }

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
                    <span className="text-gray-400 font-semibold">Editar</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Configuración de Alertas</h1>
            </div>

            <AlertConfigForm
                initialData={mapBackendToForm(configDetail)}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/dashboard/alertconfiguration')}
                isSubmitting={isSubmitting || isFetching}
            />
        </div>
    );
};