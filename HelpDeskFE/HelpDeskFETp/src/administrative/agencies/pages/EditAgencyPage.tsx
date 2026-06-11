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

  const { updateAgency, getAgencyById, isLoading, isFetching, agency } = useAgencies('', 1, 1);
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Agencias</h1>
      </div>

      <AgencyForm 
  initialData={agency ? {
    id: agency.id,
    name: agency.name,
    address: agency.address || '',
    email: agency.email || '',
    phoneNumber: agency.contact || '', 
    idOrganization:  agency.organizationId ,
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