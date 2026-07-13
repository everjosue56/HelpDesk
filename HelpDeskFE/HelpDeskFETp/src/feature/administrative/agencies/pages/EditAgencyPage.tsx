import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAgencies } from '../hooks/useAgencies';
import { useOrganizations } from '../../organizations/hooks/useOrganizations';
import { AgencyForm } from '../components/AgencyForm';
import { toast } from 'sonner';

export const EditAgencyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const agencyId = Number(id);

  const { updateAgency, getAgencyById, isLoading, isFetching, agency } = useAgencies('', '', 1, 1);
  const { organizations: realOrganizations } = useOrganizations('', 1, 100);

  useEffect(() => {
    if (agencyId) {
      getAgencyById(agencyId);
    }
  }, [agencyId, getAgencyById]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    if (!agencyId) return;

    const payloadProcesado = {
      name: values.name,
      address: values.address,
      phoneNumber: values.phoneNumber,
      email: values.email,
      idOrganization: Number(values.idOrganization),
      isActive: values.isActive,
    };

    try {
      await updateAgency(agencyId, payloadProcesado);
      toast.success("Agencia actualizada con éxito");
      navigate('/dashboard/agencies');
    } catch (error) {
      console.error(" Error capturado en el catch del submit:", error);
      toast.error("Error al actualizar la agencia");
    }
  };

  if (isFetching) return <div>Cargando...</div>;


  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn">
      {/* Historial superior (Breadcrumbs) */}
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
          <span className="text-gray-400 font-semibold">Editar</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          Agencias
        </h1>
      </div>

      <AgencyForm
        initialData={agency ? {
          id: agency.id,
          name: agency.name,
          address: agency.address || '',
          email: agency.email || '',
          phoneNumber: agency.contact || '',
          idOrganization: agency.organizationId,
          isActive: agency.isActive
        } : undefined}
        organizations={realOrganizations}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/agencies')}
        isSubmitting={isLoading}
      />
    </div>
  );
};