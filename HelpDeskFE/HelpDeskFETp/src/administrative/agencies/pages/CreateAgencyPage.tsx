import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgencies } from '../hooks/useAgencies';
import { useOrganizations } from '../../organizations/hooks/useOrganizations'; // 🚀 1. Importamos tu hook real de organizaciones
import { AgencyForm } from '../components/AgencyForm';
import { type AgencyFormValues } from '../hooks/agencySchema';
import { toast } from "sonner";

export const CreateAgencyPage: React.FC = () => {
  const navigate = useNavigate();
  const { createAgency, isLoading } = useAgencies('', 1, 1);

  const { organizations: realOrganizations } = useOrganizations('', 1, 100);

  const handleSubmit = async (values: AgencyFormValues) => {
    try {

      await createAgency({ 
        ...values,
        idOrganization: Number(values.idOrganization), 
        isActive: true 
      });
      
      toast.success("Agencia registrada exitosamente", {
        description: `La agencia "${values.name}" ha sido guardada en el sistema.`,
      });

      navigate('/dashboard/agencies');
    } catch (error) {
      console.error(error);
      toast.error("No se pudo registrar la agencia", {
        description: "Hubo un problema con el servidor. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">
      
      {/* Historial superior */}
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
            onClick={() => navigate('/dashboard/organizations')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Administrativo
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span
            onClick={() => navigate('/dashboard/agencies')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Agencias
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-gray-400 font-semibold">Crear</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          Agencias
        </h1>
      </div>

      {/* Formulario Conectado */}
      <AgencyForm 
        initialData={undefined} 
        organizations={realOrganizations} 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/agencies')}
        isSubmitting={isLoading}
      />
    </div>
  );
};