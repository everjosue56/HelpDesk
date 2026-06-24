import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTypeErrors } from '../hooks/useTypeErrors';
import { TypeErrorForm, type TypeErrorFormValues } from '../components/TypeErrorForm';
import { toast } from "sonner";

export const EditTypeErrorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const errorId = Number(id);

    const { typeError, getTypeErrorById, updateTypeError, isLoading } = useTypeErrors('', 1, 5);

    useEffect(() => {
        if (errorId) {
            getTypeErrorById(errorId);
        }
    }, [errorId, getTypeErrorById]);

    const handleSubmit = async (values: TypeErrorFormValues) => {
        try {
            await updateTypeError(errorId, { 
                name: values.name,    
            });
            
            toast.success("Tipo de error actualizado exitosamente", {
                description: `La clasificación "${values.name}" ha sido modificada en el catálogo.`,
            });

            navigate('/dashboard/typeerror');
        } catch (error) {
            console.error(error);
            toast.error("No se pudo actualizar el tipo de error");
        }
    };

    if (isLoading && !typeError) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-sm font-medium text-gray-400 animate-pulse">
                Recuperando la configuración de la falla desde el servidor...
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans text-left">
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/tickets')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Soporte</span>
                     <span onClick={() => navigate('/dashboard/typeerror')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Tipos de Errores</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-gray-400 font-semibold">Editar</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Tipos de Errores</h1>
            </div>

            <TypeErrorForm 
                initialData={typeError} 
                onSubmit={handleSubmit}
                onCancel={() => navigate('/dashboard/typeerror')}
                isSubmitting={isLoading}
            />
        </div>
    );
};