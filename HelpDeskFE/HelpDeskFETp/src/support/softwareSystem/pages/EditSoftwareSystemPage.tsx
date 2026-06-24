import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSoftwareSystems } from '../hooks/useSoftwareSystems';
import { SoftwareSystemForm, type SoftwareSystemFormValues } from '../components/SoftwareSystemForm';
import { toast } from "sonner";

export const EditSoftwareSystemPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const systemId = Number(id);

    const { systems, updateSystem, isLoading } = useSoftwareSystems('', 1, 100);
    const currentSystem = systems.find(s => s.id === systemId) || null;

    const handleSubmit = async (values: SoftwareSystemFormValues) => {
        try {
            await updateSystem(systemId, { 
                name: values.name,    
            });
            
            toast.success("Sistema afectado actualizado exitosamente", {
                description: `El sistema "${values.name}" ha sido actualizado en el catálogo.`,
            });

            navigate('/dashboard/softwaresystem');
        } catch (error) {
            console.error(error);
            toast.error("No se pudo actualizar el sistema afectado", {
                description: "Hubo un problema con el servidor al guardar los cambios.",
            });
        }
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">
            
            {/* Historial superior / Breadcrumbs */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                    >
                        Inicio
                    </span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span
                        onClick={() => navigate('/dashboard/tickets')}
                        className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                    >
                        Soporte
                    </span>
                       <span
                        onClick={() => navigate('/dashboard/softwaresystem')}
                        className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                    >
                        Sistemas Afectados
                    </span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-gray-400 font-semibold">Editar</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                    Editar
                </h1>
            </div>

            {systems.length === 0 && isLoading ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-sm font-medium text-gray-400 animate-pulse">
                    Obteniendo especificaciones del sistema desde el servidor...
                </div>
            ) : (
                <SoftwareSystemForm 
                    initialData={currentSystem} 
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/dashboard/softwaresystem')}
                    isSubmitting={isLoading}
                />
            )}
        </div>
    );
};