import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { TicketForm, type TicketFormValues } from '../components/TicketForm';
import { toast } from "sonner";

export const EditTicketPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const ticketId = Number(id);

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [initialTicketData, setInitialTicketData] = useState<TicketFormValues | null>(null);

    const { updateTicket, getTicketById, isLoading: isUpdating } = useTickets('', 1, 5);

   useEffect(() => {
    let isMounted = true;
    
    const fetchTicket = async () => {
        if (!ticketId) return;
        try {
            setIsLoadingData(true);
            const res = await getTicketById(ticketId);
            
            if (isMounted && res) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const resAny = res as any;
                const ticketData = resAny?.data || resAny?.Data || resAny;

                setInitialTicketData({
                    description: ticketData.description || '',
                    idArea: ticketData.idArea || null,
                    idSoftwareSystem: ticketData.idSoftwareSystem || null,
                    idTypeError: ticketData.idTypeError || null,
                    idImpact: ticketData.idImpact || null,
                    idUser: ticketData.idUser || null,
                    idPriority: ticketData.idPriority || null,
                    isActive: ticketData.isActive ? "1" : "2"
                });
            }
        } catch (error) {
            console.error("Error cargando ticket por ID:", error);
            toast.error("No se pudo recuperar la información del ticket.");
        } {
            if (isMounted) setIsLoadingData(false);
        }
    };

    fetchTicket();
    return () => { isMounted = false; };
}, [ticketId, getTicketById]);
    const handleSubmit = async (values: TicketFormValues) => {
        try {
            await updateTicket(ticketId, {
                description: values.description,
               idArea: Number(values.idArea || "0"),
                idSoftwareSystem: Number(values.idSoftwareSystem),
                idTypeError: Number(values.idTypeError),
                idImpact: Number(values.idImpact),
                idPriority: Number(values.idPriority),
                isActive: values.isActive === "1" 
            });

            toast.success("Ticket actualizado exitosamente", {
                description: "Los cambios de la incidencia técnica han sido guardados.",
            });

            navigate('/dashboard/tickets');
        } catch (error) {
            console.error(error);
            toast.error("No se pudo actualizar el ticket", {
                description: "Hubo un error con el servidor al guardar las modificaciones.",
            });
        }
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">
            
            {/* Breadcrumbs superiores */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Soporte</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Tickets</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-gray-400 font-semibold">Editar</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                    Tickets
                </h1>
            </div>

            {isLoadingData ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-sm font-medium text-gray-400 animate-pulse">
                    Sincronizando los detalles del ticket con el servidor central...
                </div>
            ) : (
                <TicketForm 
                    initialData={initialTicketData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/dashboard/tickets')}
                    isSubmitting={isUpdating}
                />
            )}
        </div>
    );
};