import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { agencySchema, type AgencyFormValues } from '../hooks/agencySchema';
import { X, Save, Building2 } from 'lucide-react';
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

interface AgencyFormProps {
    initialData?: AgencyFormValues & { id?: number };
    organizations: { id: number; name: string }[];
    onSubmit: (data: AgencyFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const AgencyForm: React.FC<AgencyFormProps> = ({
    initialData,
    organizations,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;

    const form = useForm<AgencyFormValues>({
        resolver: zodResolver(agencySchema),
        defaultValues: {
            name: '',
            address: '',
            phoneNumber: '',
            email: '',
            idOrganization: undefined,
            isActive: true,
        },
    });

    // Resetear valores en modo edición incluyendo los campos heredados del DTO de .NET
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                address: initialData.address || '',
                phoneNumber: initialData.phoneNumber || '',
                email: initialData.email || '',
                idOrganization: initialData.idOrganization,
                isActive: initialData.isActive ?? true,
            });
        }
    }, [initialData, form]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn">

            {/* Encabezado Interno */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <Building2 className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Agencia' : 'Nueva Agencia'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode
                            ? 'Modifica los campos necesarios para actualizar la agencia'
                            : 'Completa el formulario para registrar una nueva agencia'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                        {/* Campo: Nombre */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Nombre de la Agencia</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Organización Empresarial" {...field} className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal " />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Seleccionar Organización */}
                        <FormField
                            control={form.control}
                            name="idOrganization"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Seleccione una Organización</FormLabel>
                                    <Select
                                        //  1. CONVERSIÓN EN EL CAMBIO: Transformamos el string del Select a un número real para el formulario
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        //  2. BLINDAJE DEL VALOR INICIAL: Si hay ID lo hacemos string; si es undefined o null usas "" para mantenerlo controlado
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {organizations.map((org) => (
                                                <SelectItem key={org.id} value={String(org.id)} className="cursor-pointer">
                                                    {org.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Dirección */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Dirección</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Torre Innovation, Piso 15" {...field} className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Seleccionar Estado */}
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={(val) => field.onChange(val === 'true')}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                                    >
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Teléfono */}
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Teléfono</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. 9578-2532" {...field} className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <div /> {/* Espacio vacío para balancear el grid */}

                        {/* Campo: Correo Electrónico */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. hola@mundo.com" {...field} className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={onCancel}
                            variant="outline"
                            className="rounded-xl h-11 px-6 font-semibold bg-gray-400 hover:bg-gray-500 text-white hover:text-white border-none transition-colors gap-2"
                        >
                            <X className="h-4 w-4" />
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl h-11 px-6 font-semibold bg-[#1a558b] hover:bg-[#133f67] text-white transition-colors gap-2 shadow-sm"
                        >
                            <Save className="h-4 w-4" />
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};