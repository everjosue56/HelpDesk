import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResolutions } from '../hooks/useResolutions';
import { ResolutionForm } from '../components/ResolutionForm';
import { toast } from 'sonner';

export const CreateResolutionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const preselectedTicketId = (location.state as { idTicket?: number } | null)?.idTicket;
    const { createResolution, isLoading } = useResolutions('', 1, 5);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (values: any) => {
        try {
            await createResolution({
                idTicket: Number(values.idTicket),
                actionTaken: values.actionTaken,
                idSolutionStatus: Number(values.idSolutionStatus),
                rootCause: values.rootCause,
                preventiveMeasures: values.preventiveMeasures || null,
                observation: values.observation || null,
                secondObservation: values.secondObservation || null,
                idPriority: Number(values.idPriority),
                idDevice: (values.idDevice && values.idDevice !== 0 && values.idDevice !== "0")
                    ? Number(values.idDevice)
                    : undefined,
                solutionTime: Number(values.solutionTime)
            });

            toast.success("Resolución registrada correctamente en el sistema");
            navigate('/dashboard/resolutions');
        } catch (error) {
            console.error("Error al registrar la solución:", error);
            toast.error("Error al guardar el registro de la resolución");
        }
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">
            {/* Breadcrumbs e Historial Superior */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Soporte</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/resolutions')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Resoluciones</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-gray-400 font-semibold">Crear</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Resoluciones</h1>
            </div>

            <ResolutionForm
                initialData={preselectedTicketId ? { idTicket: preselectedTicketId } : undefined}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/dashboard/resolutions')}
                isSubmitting={isLoading}
            />
        </div>
    );
};