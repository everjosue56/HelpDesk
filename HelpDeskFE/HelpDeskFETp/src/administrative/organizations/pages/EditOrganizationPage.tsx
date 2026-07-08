import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrganizationForm } from '../components/OrganizationForm';
import { useOrganizations } from '../hooks/useOrganizations';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

export const EditOrganizationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        organization,
        isFetching,
        isLoading,
        getOrganizationById,
        updateOrganization
    } = useOrganizations('', 1, 1);

    useEffect(() => {
        if (id) getOrganizationById(Number(id));
    }, [id, getOrganizationById]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEditSubmit = async (values: any) => {
        if (!id) return;
        try {
            await updateOrganization(Number(id), {
                name: values.name,
                phoneNumber: values.contact,
                description: values.description || '',
                address: values.address,
                logo: values.logo || ''
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            toast.success("Organización actualizada", {
                description: `Los cambios en "${values.name}" se guardaron con éxito en el sistema.`,
                duration: 4000,
            });
            navigate('/dashboard/organizations');

        } catch (error) {
            console.error(error);
            toast.error("Error al guardar cambios", {
                description: "No se pudieron procesar las modificaciones. Inténtalo de nuevo.",
            });
        }
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

            {/* ─── BREADCRUMBS MODERNIZADOS ─── */}
            <div className="flex flex-col gap-1">
                <div className="text-xs font-medium text-gray-400 flex items-center gap-1.5 tracking-wide select-none">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-gray-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/organizations')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Administrativo</span>
                    <span className="text-gray-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/organizations')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Organización</span>
                    <span className="text-gray-300 font-normal">&gt;</span>
                    <span className="text-gray-400 font-semibold">Editar</span>
                </div>

                {/* Contexto del Header de la página */}
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                    Organizaciones
                </h1>
            </div>

            {/* ─── CONTROL DE CARGA INICIAL  ─── */}
            {isFetching ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-slate-500 bg-white border border-gray-200 rounded-2xl p-12 shadow-sm">
                    <Loader2 className="h-7 w-7 animate-spin text-[#1a558b]" />
                    <p className="text-xs font-semibold tracking-wide">Cargando información de la organización...</p>
                </div>
            ) : (
                <OrganizationForm
                    initialData={organization}
                    onSubmit={handleEditSubmit}
                    onCancel={() => navigate('/dashboard/organizations')}
                    isSubmitting={isLoading}
                />
            )}
        </div>
    );
};