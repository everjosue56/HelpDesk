import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAreas, type AreaItem } from '../hooks/useAreas';
import { useAgencies } from '../../agencies/hooks/useAgencies';
import { AreaForm } from '../components/AreaForm';
import { type AreaFormValues } from '../hooks/areaSchema';
import { toast } from "sonner";

export const EditAreaPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const areaId = Number(id);

  const { updateArea, getAreaById, isLoading, isFetching } = useAreas('', '', 1, 1);
  const { agencies: realAgencies } = useAgencies('', '', 1, 100);

  const [dbArea, setDbArea] = useState<AreaItem | null>(null);

  // Carga inicial del registro específico desde usando Orval
  useEffect(() => {
    const loadArea = async () => {
      if (!areaId) return;
      const data = await getAreaById(areaId);
      if (data) {
        setDbArea(data);
      } else {
        toast.error("No se encontró el área especificada");
        navigate('/dashboard/areas');
      }
    };
    loadArea();
  }, [areaId, getAreaById, navigate]);

  const handleSubmit = async (values: AreaFormValues) => {
    try {
      await updateArea(areaId, {
        nameArea: values.name,
        idAgency: Number(values.idAgency),
        isActive: values.isActive
      });

      toast.success("Área actualizada exitosamente", {
        description: `Los cambios en el área "${values.name}" se guardaron correctamente.`,
      });

      navigate('/dashboard/areas');
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el área", {
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
          <span className="text-gray-400 font-semibold">Editar</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          Áreas
        </h1>
      </div>

      {/* Renderizado condicional mientras Orval responde */}
      {isFetching ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 font-medium animate-pulse">
          Recuperando información del área...
        </div>
      ) : (
        <AreaForm
          initialData={
            dbArea 
              ? {
                  id: dbArea.id,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  name: dbArea.nameArea || (dbArea as any).nameArea || '', 
                  idAgency: dbArea.idAgency,
                  isActive: dbArea.isActive ?? true,
                }
              : undefined
          }
          agencies={realAgencies}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/areas')}
          isSubmitting={isLoading}
        />
      )}
    </div>
  );
};