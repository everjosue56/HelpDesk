import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypeErrors } from '../hooks/useTypeErrors';
import { TypeErrorForm, type TypeErrorFormValues } from '../components/TypeErrorForm';
import { toast } from "sonner";

export const CreateTypeErrorPage: React.FC = () => {
    const navigate = useNavigate();
    const { createTypeError, isLoading } = useTypeErrors('', 1, 5);

    const handleSubmit = async (values: TypeErrorFormValues) => {
        try {
            await createTypeError({ 
                name: values.name,    
            });
            
            toast.success("Tipo de error registrado exitosamente", {
                description: `La clasificación "${values.name}" ha sido guardada en el catálogo.`,
            });

            navigate('/dashboard/typeerror'); 
        } catch (error) {
            console.error(error);
            toast.error("No se pudo registrar el tipo de error", {
                description: "Hubo un problema con el servidor al procesar la solicitud.",
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
                        onClick={() => navigate('/dashboard/typeerror')}
                        className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                    >
                        Tipos de Errores
                    </span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-gray-400 font-semibold">Crear</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                    Crear
                </h1>
            </div>

            {/* Tarjeta del Formulario */}
            <TypeErrorForm 
                initialData={undefined} 
                onSubmit={handleSubmit}
                onCancel={() => navigate('/dashboard/typeerror')}
                isSubmitting={isLoading}
            />
        </div>
    );
};