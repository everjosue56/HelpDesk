import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUser';
import { useRoles } from '../../roles/hooks/useRoles';
import { useAgencies } from '../../agencies/hooks/useAgencies';
import { useAreas } from '../../areas/hooks/useAreas';
import { UserForm } from '../components/UserForm';
import { type UserFormValues } from '../hooks/userSchema';
import { toast } from "sonner";

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();

  const { createUser, isLoading } = useUsers('', null, null, null, null, 1, 100);

  const { roles = [] } = useRoles();
  const { agencies = [] } = useAgencies('', '', 1, 100);
  const { areas = [] } = useAreas('', '', 1, 100);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      await createUser({
        firstName: values.firstName,
        lastName: values.lastName,
        userName: values.userName,
        email: values.email,
        phoneNumber: values.phoneNumber || undefined,
        password: values.password || "",
        idRol: Number(values.idRol),
        idAgency: Number(values.idAgency),
        idArea: Number(values.idArea),
        isActive: values.isActive
      });

      toast.success("Usuario registrado exitosamente", {
        description: `El funcionario "${values.firstName} ${values.lastName}" ha sido guardado en el sistema.`,
      });

      navigate('/dashboard/users');
    } catch (error) {
      console.error(error);
      toast.error("No se pudo registrar el usuario", {
        description: "Hubo un problema. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

      {/* Historial  */}
      <div className="flex flex-col gap-0.5">
        <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide select-none">
          <span onClick={() => navigate('/dashboard')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span onClick={() => navigate('/dashboard/organizations')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Administrativo</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span onClick={() => navigate('/dashboard/users')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Usuarios</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-gray-400 font-semibold">Crear</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Usuarios</h1>
      </div>

      <UserForm
        initialData={undefined}
        roles={roles}
        agencies={agencies}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        areas={areas.map((item: any) => ({
          id: item.id,
          name: item.nameArea || item.name || 'Sin nombre'
        }))}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/users')}
        isSubmitting={isLoading}
      />
    </div>
  );
};