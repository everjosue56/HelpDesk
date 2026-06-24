import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResolutions } from '../hooks/useResolutions';
import { ResolutionForm } from '../components/ResolutionForm';
import { toast } from "sonner";

export const EditResolutionPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { getResolutionById, updateResolution, isLoading } = useResolutions('', 1, 5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [resolutionData, setResolutionData] = useState<any | null>(null);
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
        const loadResolution = async () => {
            if (!id) return;
            try {
                setIsFetchingData(true);
                const result = await getResolutionById(Number(id));
                
                if (result) {
                    console.log("Respuesta cruda del backend (Resolución):", result);
                    
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const resAny = result as any;
                    const data = resAny?.data || resAny?.Data || resAny;
                    const ticketId = data.idTicket || data.IdTicket;
                    const solutionStatusId = data.idSolutionStatus || data.IdSolutionStatus;
                    const priorityId = data.idPriority || data.IdPriority;
                    const deviceId = data.idDevice || data.IdDevice;

                    setResolutionData({
                        id: data.id,
                        idTicket: ticketId ? String(ticketId) : '',
                        actionTaken: data.actionTaken || '',
                        rootCause: data.rootCause || '',
                        preventiveMeasures: data.preventiveMeasures || '',
                        observation: data.observation || '',
                        secondObservation: data.secondObservation || '',
                        idSolutionStatus: solutionStatusId ? String(solutionStatusId) : '',
                        idPriority: priorityId ? String(priorityId) : '',
                        idDevice: deviceId ? String(deviceId) : '',
                        solutionTime: data.solutionTime ?? 0
                    });
                } else {
                    toast.error("No se localizó la resolución solicitada");
                    navigate('/dashboard/resolutions');
                }
            } catch (error) {
                console.error("Error al cargar la resolución para actualización:", error);
                toast.error("Error al recuperar la información del servidor");
            } finally {
                setIsFetchingData(false);
            }
        };

        loadResolution();
    }, [id, getResolutionById, navigate]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (values: any) => {
        if (!id) return;
        try {
            await updateResolution(Number(id), {
                idTicket: Number(values.idTicket),
                actionTaken: values.actionTaken,
                idSolutionStatus: Number(values.idSolutionStatus),
                rootCause: values.rootCause,
                preventiveMeasures: values.preventiveMeasures || null,
                observation: values.observation || null,
                secondObservation: values.secondObservation || null,
                idPriority: Number(values.idPriority),
                idDevice: values.idDevice ? Number(values.idDevice) : undefined,
                solutionTime: Number(values.solutionTime) 
            });

            toast.success("Registro de resolución modificado con éxito");
            navigate('/dashboard/resolutions');
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar los cambios en la resolución");
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
                    <span className="text-gray-400 font-semibold">Editar</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Resoluciones</h1>
            </div>

            {isFetchingData ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-medium text-gray-400 animate-pulse">
                    Sincronizando ficha con la base de datos...
                </div>
            ) : (
                <ResolutionForm
                    initialData={resolutionData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/dashboard/resolutions')}
                    isSubmitting={isLoading}
                />
            )}
        </div>
    );
};