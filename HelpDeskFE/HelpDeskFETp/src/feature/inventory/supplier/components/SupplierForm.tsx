import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, Save, X } from 'lucide-react';
import { Button } from '../../../../../@/components/ui/button';
import { Input } from '../../../../../@/components/ui/input';
import { Textarea } from '../../../../../@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../../../@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../../../@/components/ui/select';
import { useOrganizations } from '../../../administrative/organizations/hooks/useOrganizations';

export interface SupplierFormValues {
    idOrganization: string | number;
    name: string;
    description: string;
    contact: string;
    email: string;
    phone: string;
    registrationDate: string;
    address: string;
    compliance: boolean;
    isActive: boolean;
}

interface SupplierFormProps {
    initialData?: (Partial<SupplierFormValues> & { id?: number }) | null;
    onSubmit: (data: SupplierFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;
    const { organizations } = useOrganizations('', 1, 100);

    const form = useForm<SupplierFormValues>({
        mode: 'onBlur',
        defaultValues: {
            idOrganization: '',
            name: '',
            description: '',
            contact: '',
            email: '',
            phone: '',
            registrationDate: new Date().toISOString().slice(0, 10),
            address: '',
            compliance: false,
            isActive: true,
        },
    });

    useEffect(() => {
        if (initialData && organizations?.length) {
            form.reset({
                idOrganization: initialData.idOrganization ? String(initialData.idOrganization) : '',
                name: initialData.name || '',
                description: initialData.description || '',
                contact: initialData.contact || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                registrationDate: initialData.registrationDate
                    ? initialData.registrationDate.slice(0, 10)
                    : new Date().toISOString().slice(0, 10),
                address: initialData.address || '',
                compliance: initialData.compliance ?? false,
                isActive: initialData.isActive ?? true,
            });
        }
    }, [initialData, form, organizations]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left select-none">
            {/* Encabezado */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <Building2 className="h-6 w-6 text-[#1a558b]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode
                            ? 'Modifica los datos comerciales y de contacto del proveedor'
                            : 'Añade un nuevo proveedor al catálogo institucional'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        {/* Selector: Organización */}
                        <FormField
                            control={form.control}
                            name="idOrganization"
                            rules={{ required: 'Debe seleccionar una organización.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Organización</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ? String(field.value) : ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none placeholder:text-gray-400 placeholder:font-normal">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {organizations?.map((org) => (
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

                        {/* Nombre del Proveedor */}
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: 'El nombre del proveedor es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Empresa/Proveedor</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. Distribuidora Tecnológica S.A."
                                            {...field}
                                            className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Contacto */}
                        <FormField
                            control={form.control}
                            name="contact"
                            rules={{ required: 'El nombre de contacto es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Persona de Contacto</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. Juan Pérez (Gerente de Cuentas)"
                                            {...field}
                                            className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Correo Electrónico */}
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Ingrese un correo electrónico válido.',
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="contacto@proveedor.com"
                                            {...field}
                                            className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Teléfono */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Teléfono</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="+504 9999-9999"
                                            {...field}
                                            className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Fecha de Registro */}
                        <FormField
                            control={form.control}
                            name="registrationDate"
                            rules={{ required: 'La fecha de registro es obligatoria.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Fecha de Registro</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                            className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Dirección */}
                        <div className="md:col-span-2">
                            <FormField
                                control={form.control}
                                name="address"
                                rules={{ required: 'La dirección es obligatoria.' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-700">Dirección Física</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Dirección completa o ubicación de la sede central"
                                                {...field}
                                                className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500 font-medium" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Selector: Cumplimiento de Políticas */}
                        <FormField
                            control={form.control}
                            name="compliance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Cumplimiento de Políticas</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(val === 'true')}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : 'false'}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            <SelectItem value="true" className="cursor-pointer">Cumple Requisitos</SelectItem>
                                            <SelectItem value="false" className="cursor-pointer">No Cumple Requisitos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Selector: Estado */}
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Estado del Proveedor</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(val === 'true')}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : 'true'}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder="Seleccionar Estado" />
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

                        {/* Descripción / Notas */}
                        <div className="md:col-span-2">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-700">Descripción / Servicios Suministrados</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describa el tipo de servicios, acuerdos comerciales o información adicional..."
                                                {...field}
                                                className="rounded-xl border-gray-200 pl-5 min-h-24 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500 font-medium" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={onCancel}
                            variant="outline"
                            className="rounded-xl h-11 px-6 font-semibold bg-gray-400 hover:bg-gray-500 text-white border-none cursor-pointer shadow-none"
                        >
                            <X className="h-4 w-4" /> Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl h-11 px-6 font-semibold bg-[#1a558b] hover:bg-[#133f67] text-white cursor-pointer shadow-none"
                        >
                            <Save className="h-4 w-4" /> {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};