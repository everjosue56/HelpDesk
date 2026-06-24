import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { TicketForm, type TicketFormValues } from '../components/TicketForm';
import { toast } from "sonner";

export const CreateTicketPage: React.FC = () => {
    const navigate = useNavigate();
    
    const { createTicket, isLoading } = useTickets('', 1, 5);

   const handleSubmit = async (values: TicketFormValues) => {
    try {
        await createTicket({
            description: values.description,
            idArea: Number(values.idArea),
            idSoftwareSystem: Number(values.idSoftwareSystem),
            idTypeError: Number(values.idTypeError), 
            idImpact: Number(values.idImpact),
            idPriority: Number(values.idPriority),
            isActive: values.isActive === "1" 
        });

        toast.success("Ticket registrado exitosamente", {
            description: "La incidencia técnica ha sido añadida a la cola de soporte.",
        });

        navigate('/dashboard/tickets');
    } catch (error) {
        console.error(error);
        toast.error("No se pudo registrar el ticket");
    }
};

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">
            
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Soporte</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Tickets</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-gray-400 font-semibold">Crear</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                    Tickets
                </h1>
            </div>

            <TicketForm 
                initialData={undefined}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/dashboard/tickets')}
                isSubmitting={isLoading}
            />
        </div>
    );
};