import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, User } from 'lucide-react';
import { Input } from '../../../../@/components/ui/input';
import { Button } from '../../../../@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../../@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../../@/components/ui/select';
import type { UserFormValues } from '../hooks/userSchema';

interface CatalogItem {
    id: number;
    name: string;
}

interface UserFormProps {
    initialData?: UserFormValues & { id?: number; agencyId?: number; areaId?: number; roleId?: number };
    roles: CatalogItem[];
    agencies: CatalogItem[];
    areas: CatalogItem[];
    onSubmit: (data: UserFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
    initialData,
    roles,
    agencies,
    areas,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<UserFormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            phoneNumber: "",
            password: "",
            idRol: 0,
            idAgency: 0,
            idArea: 0,
            isActive: true,
        },
    });

    // Sincronizar el formulario con los datos cargados en modo edición
    useEffect(() => {
        if (initialData) {
            // Mapeamos los campos de texto normales
            form.setValue("firstName", initialData.firstName || "");
            form.setValue("lastName", initialData.lastName || "");
            form.setValue("userName", initialData.userName || "");
            form.setValue("email", initialData.email || "");
            form.setValue("phoneNumber", initialData.phoneNumber || "");
            form.setValue("password", "");
            form.setValue("isActive", initialData.isActive ?? true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const targetRol = initialData.idRol || initialData.roleId || (initialData as any)?.role?.id || 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const targetAgency = initialData.idAgency || initialData.agencyId || (initialData as any)?.agency?.id || 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const targetArea = initialData.idArea || initialData.areaId || (initialData as any)?.area?.id || 0;

            // Asignamos directamente al estado del formulario como números reales
            form.setValue("idRol", Number(targetRol));
            form.setValue("idAgency", Number(targetAgency));
            form.setValue("idArea", Number(targetArea));
        }
    }, [initialData, form]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left">

            {/* Encabezado Interno */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <User className="h-6 w-6 text-[#1a558b]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Parámetros de Usuario' : 'Nuevo Funcionario'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode
                            ? 'Modifica las relaciones institucionales y accesos del usuario'
                            : 'Completa el formulario para registrar una nueva cuenta de acceso'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                        {/* Campo: Primer Nombre */}
                        <FormField<UserFormValues>
                            rules={{ required: "El nombre es obligatorio" }}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Primer Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. Juan"
                                            {...field}
                                            value={typeof field.value === 'string' ? field.value : ""}
                                            className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Apellido */}
                        <FormField<UserFormValues>
                            rules={{ required: "El apellido es obligatorio" }}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Apellido</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. Perez"
                                            {...field}
                                            value={typeof field.value === 'string' ? field.value : ""}
                                            className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Nombre de Usuario */}
                        <FormField<UserFormValues>
                            rules={{ required: "El nombre de usuario es obligatorio" }}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Nombre de Usuario (@)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. juanPerez01"
                                            disabled={isEditMode}
                                            {...field}
                                            value={typeof field.value === 'string' ? field.value : ""}
                                            className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal font-mono disabled:bg-gray-50"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Teléfono */}
                        <FormField<UserFormValues>
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Teléfono / Contacto</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. 9999-9999"
                                            {...field}
                                            value={typeof field.value === 'string' ? field.value : ""}
                                            className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Correo Electrónico */}
                        <FormField<UserFormValues>
                            rules={{
                                required: "El correo es obligatorio",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Formato de correo inválido"
                                }
                            }}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Ej. ejemplo@me.com"
                                            {...field}
                                            value={typeof field.value === 'string' ? field.value : ""}
                                            className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Contraseña */}
                        <FormField<UserFormValues>
                            rules={{
                                // Validamos la longitud solo si el usuario escribió algo
                                minLength: {
                                    value: 8,
                                    message: "La contraseña debe tener al menos 8 caracteres"
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                    message: "Debe incluir al menos una letra y un número"
                                }
                            }}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">
                                        Contraseña {isEditMode ? '(Dejar vacío para mantener)' : ''}
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder={isEditMode ? "••••••••••••" : "Escriba una contraseña segura"}
                                                {...field}
                                                value={typeof field.value === 'string' ? field.value : ""}
                                                className="rounded-xl border-gray-200 h-11 pl-5 pr-11 placeholder:text-gray-400 placeholder:font-normal"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 cursor-pointer"
                                                tabIndex={-1}
                                            >
                                                {/* 
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                */}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* ─── SELECTOR: ROL INSTITUCIONAL ─── */}
                        <FormField<UserFormValues>
                            rules={{
                                validate: (val) => Number(val) > 0 || "Debes seleccionar un rol"
                            }}
                            name="idRol"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Seleccione un Rol</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value && field.value !== 0 ? String(field.value) : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white">
                                                <SelectValue placeholder="Seleccionar Rol" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {roles.map((item) => (
                                                <SelectItem key={item.id} value={String(item.id)} className="cursor-pointer">
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* ─── SELECTOR: AGENCIA  ─── */}
                        <FormField<UserFormValues>
                            rules={{
                                validate: (val) => Number(val) > 0 || "Debes seleccionar una agencia"
                            }}
                            name="idAgency"
                            render={({ field }) => (
                                <FormItem className="text-left">
                                    <FormLabel className="text-sm font-bold text-slate-700">Agencia</FormLabel>
                                    <Select
                                        value={field.value && field.value !== 0 ? String(field.value) : ""}
                                        onValueChange={(val) => field.onChange(Number(val))}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white">
                                                <SelectValue placeholder="Seleccionar agencia" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {agencies.map((agency) => (
                                                <SelectItem key={agency.id} value={String(agency.id)} className="cursor-pointer">
                                                    {agency.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* ─── SELECTOR: ÁREA/DEPARTAMENTO ─── */}
                        <FormField<UserFormValues>
                            rules={{
                                validate: (val) => Number(val) > 0 || "Debes seleccionar una area"
                            }}
                            name="idArea"
                            render={({ field }) => (
                                <FormItem className="text-left">
                                    <FormLabel className="text-sm font-bold text-slate-700">Área Operativa</FormLabel>
                                    <Select
                                        value={field.value && field.value !== 0 ? String(field.value) : ""}
                                        onValueChange={(val) => field.onChange(Number(val))}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white">
                                                <SelectValue placeholder="Seleccionar área" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {areas.map((area) => (
                                                <SelectItem key={area.id} value={String(area.id)} className="cursor-pointer">
                                                    {area.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />
                        {/* Campo: Seleccionar Estado */}
                        <FormField
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Estado</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(val === 'true')}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : "true"}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white">
                                                <SelectValue placeholder="Seleccionar estado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            <SelectItem value="true" className="cursor-pointer">Activo</SelectItem>
                                            <SelectItem value="false" className="cursor-pointer">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={onCancel}
                            variant="outline"
                            className="rounded-xl h-11 px-6 font-semibold bg-gray-400 hover:bg-gray-500 text-white hover:text-white border-none transition-colors gap-2 cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl h-11 px-6 font-semibold bg-[#1a558b] hover:bg-[#133f67] text-white transition-colors gap-2 shadow-sm cursor-pointer"
                        >
                            <Save className="h-4 w-4" />
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}