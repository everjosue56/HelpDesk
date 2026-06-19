import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUser';
import { useRoles } from '../../roles/hooks/useRoles';
import { useAgencies } from '../../agencies/hooks/useAgencies';
import { useAreas } from '../../areas/hooks/useAreas';
import { UserForm } from '../components/UserForm';
import { type UserFormValues } from '../hooks/userSchema';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

export const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = Number(id);

  const { user, isFetching, isLoading, getUserById, updateUser } = useUsers('', null, null, null, null, 1, 5);

  const { roles = [] } = useRoles();

  const { agencies = [] } = useAgencies('', '', 1, 100);
  const { areas = [] } = useAreas('', '', 1, 100);

  useEffect(() => {
    if (userId) {
      getUserById(userId);
    }
  }, [userId, getUserById]);

const handleSubmit = async (values: UserFormValues) => {
  try {
    console.log("Valores que vienen del formulario:", values);

    // 1. Preparamos el objeto base
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      firstName: values.firstName,
      lastName: values.lastName,
      userName: values.userName,
      email: values.email,
      phoneNumber: values.phoneNumber || undefined,
      idRol: Number(values.idRol),
      idAgency: Number(values.idAgency),
      idArea: Number(values.idArea),
      isActive: values.isActive,
      password: values.password // Inicialmente lo incluimos
    };

    // 2. Si la contraseña viene vacía, la eliminamos del objeto antes de enviar
    if (!payload.password || payload.password.trim() === "") {
      delete payload.password;
    }

    // 3. Enviamos el payload limpio
    await updateUser(userId, payload);

    toast.success("Usuario actualizado exitosamente", {
      description: `Los cambios para "${values.firstName} ${values.lastName}" fueron guardados.`,
    });

    navigate('/dashboard/users');
  } catch (error) {
    console.error(error);
    toast.error("Error al actualizar", {
      description: "No se pudieron salvar los parámetros.",
    });
  }
};

  if (isFetching || !user) {
  return (
    <div className="flex items-center justify-center h-96">
      <p className="text-slate-500 font-medium animate-pulse">Cargando parámetros del usuario...</p>
    </div>
  );
}

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500 font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a558b]" />
        <p className="text-sm font-medium tracking-wide">Cargando perfil del funcionario...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center space-y-4 font-sans">
        <p className="text-gray-500 font-medium">El usuario solicitado no existe o fue removido.</p>
        <button
          onClick={() => navigate('/administrative/users')}
          className="inline-flex items-center gap-2 text-sm text-[#1a558b] hover:underline cursor-pointer font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left">

      {/* Historial superior / Breadcrumbs Sincronizados */}
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
            onClick={() => navigate('/dashboard/users')}
            className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
          >
            Usuarios
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-gray-400 font-semibold">Editar</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          Usuarios
        </h1>
      </div>

      {/* Formulario Conectado */}
      <UserForm
    initialData={{
      ...user,
      id: user.id,
      idRol: user.idRol,
      idAgency: user.idAgency,
      idArea: user.idArea,
      roleId: user.idRol,
      agencyId: user.idAgency,
      areaId: user.idArea,
      password: ""
    }}
    roles={roles}
    agencies={agencies}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    areas={areas.map((item: any) => ({
      id: item.id,
      name: item.nameArea
    }))}
    onSubmit={handleSubmit}
    onCancel={() => navigate('/dashboard/users')}
    isSubmitting={isLoading}
  />
    </div>
  );
};