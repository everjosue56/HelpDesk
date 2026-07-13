import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrganizationForm } from '../components/OrganizationForm';
import { useOrganizations } from '../hooks/useOrganizations';
import { toast } from "sonner"; 

export const CreateOrganizationPage: React.FC = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    
    const { createOrganization } = useOrganizations('', 1, 5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreateSubmit = async (values: any) => {
        try {
            setSubmitting(true);
            
            // 1. Mandamos los datos limpios 
            await createOrganization({
                name: values.name,
                phoneNumber: values.contact,
                description: values.description,
                address: values.address,
                logo: values.logo || ''
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            // notificacion de creado
            toast.success("Organización creada", {
                description: `La organización "${values.name}" se registró con éxito en el sistema.`,
                duration: 4000, // Se oculta sola tras 4 segundos
            });
            navigate('/dashboard/organizations'); 

        } catch (error) {
            console.error("Error al crear la organización:", error);
            
            // notificacion de error 
            toast.error("Error al registrar", {
                description: "No se pudo crear la organización. Inténtalo de nuevo más tarde.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

        {/* ─── BREADCRUMBS  ─── */}
        <div className="flex flex-col gap-1">
            <div className="text-xs font-medium text-gray-400 flex items-center gap-1.5 tracking-wide select-none">
                <span
                    onClick={() => navigate('/dashboard')}
                    className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                >
                    Inicio
                </span>
                <span className="text-gray-300 font-normal">&gt;</span>
                <span
                    onClick={() => navigate('/dashboard/organizations')}
                    className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                >
                    Administrativo
                </span>
                <span className="text-gray-300 font-normal">&gt;</span>
                <span
                    onClick={() => navigate('/dashboard/organizations')}
                    className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
                >
                    Organización
                </span>
                <span className="text-gray-300 font-normal">&gt;</span>
                <span className="text-gray-400 font-semibold">Crear</span>
            </div>
            
            {/* Título  */}
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                Organizaciones
            </h1>
        </div>

        {/* ─── FORMULARIO COMPARTIDO ─── */}
        <OrganizationForm 
            onSubmit={handleCreateSubmit} 
            onCancel={() => navigate('/dashboard/organizations')}
            isSubmitting={submitting} 
        />
        
    </div>
);
};


  