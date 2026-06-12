import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAreas } from '../hooks/useAreas';
import { useAgencies } from '../../agencies/hooks/useAgencies'; 
import { AreaForm } from '../components/AreaForm';
import { type AreaFormValues } from '../hooks/areaSchema';
import { toast } from "sonner";

export const CreateAreaPage: React.FC = () => {
  const navigate = useNavigate();
  const { createArea, isLoading } = useAreas('', 1, 1);

  // Carga hasta 100 agencias para el selector del formulario
  const { agencies: realAgencies } = useAgencies('', 1, 100);

  const handleSubmit = async (values: AreaFormValues) => {
  try {
    await createArea({ 
      nameArea: values.name,    
      idAgency: Number(values.idAgency), 
      isActive: values.isActive ?? true 
    });
    
    toast.success("Área registrada exitosamente", {
      description: `El área "${values.name}" ha sido guardada en el sistema.`,
    });

    navigate('/dashboard/areas');
  } catch (error) {
    console.error(error);
    toast.error("No se pudo registrar el área", {
      description: "Hubo un problema con el servidor al procesar la solicitud.",
    });
  }
};

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">
      
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
            onClick={() => navigate('/dashboard/areas')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Áreas
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-gray-400 font-semibold">Crear</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          Áreas
        </h1>
      </div>

      {/* Formulario Conectado */}
      <AreaForm 
        initialData={undefined} 
        agencies={realAgencies} 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/areas')}
        isSubmitting={isLoading}
      />
    </div>
  );
};