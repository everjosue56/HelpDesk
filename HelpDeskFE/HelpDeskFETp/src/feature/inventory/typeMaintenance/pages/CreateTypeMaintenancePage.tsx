import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypeMaintenance } from '../hooks/useTypeMaintenance';
import { TypeMaintenanceForm, type TypeMaintenanceFormValues } from '../components/TypeMaintenanceForm';
import { toast } from "sonner";

export const CreateTypeMaintenancePage: React.FC = () => {
    const navigate = useNavigate();
    const { createTypeMaintenance, isLoading } = useTypeMaintenance('', 1, 5);

    const handleSubmit = async (values: TypeMaintenanceFormValues) => {
        try {
            await createTypeMaintenance({
                name: values.name,
                estimatedTime: Number(values.estimatedTime)
            });

            toast.success("Tipo de mantenimiento registrado", {
                description: `La tarea "${values.name}" ha sido guardada en el sistema de inventario.`,
            });

            navigate('/dashboard/typemaintenance');
        } catch (error) {
            console.error(error);
            toast.error("No se pudo registrar la tarea", {
                description: "Hubo un inconveniente en el servidor al procesar la solicitud.",
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
                    <span className="text-gray-400 font-semibold">Crear</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                    Tipo Mantenimiento
                </h1>
            </div>

            <TypeMaintenanceForm
                initialData={undefined}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/dashboard/typemaintenance')}
                isSubmitting={isLoading}
            />
        </div>
    );
};