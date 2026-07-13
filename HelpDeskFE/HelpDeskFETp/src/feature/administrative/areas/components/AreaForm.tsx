import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { areaSchema, type AreaFormValues } from '../hooks/areaSchema'; 
import { X, Save, LayoutGrid } from 'lucide-react';
import { Input } from '../../../../../@/components/ui/input';
import { Button } from '../../../../../@/components/ui/button';
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

interface AreaFormProps {
    initialData?: AreaFormValues & { id?: number };
    agencies: { id: number; name: string }[];
    onSubmit: (data: AreaFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const AreaForm: React.FC<AreaFormProps> = ({
    initialData,
    agencies,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;

    const form = useForm<AreaFormValues>({
        resolver: zodResolver(areaSchema),
        defaultValues: {
            name: '',
            idAgency: undefined,
            isActive: true,
        },
    });

    // Resetear valores en modo edición mapeando los datos 
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                idAgency: initialData.idAgency,
                isActive: initialData.isActive ?? true,
            });
        }
    }, [initialData, form]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left">

            {/* Encabezado Interno */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <LayoutGrid className="h-6 w-6 text-[#1a558b]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Área' : 'Nueva Área'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode
                            ? 'Modifica los campos necesarios para actualizar el área'
                            : 'Completa el formulario para registrar una nueva área organizativa'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Grid adaptado para los 3 campos limpios */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                        {/* Campo: Nombre del Área */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Nombre del Área</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Ej. Soporte Técnico / Operaciones" 
                                            {...field} 
                                            className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal" 
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Seleccionar Agencia */}
                        <FormField
                            control={form.control}
                            name="idAgency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Seleccione una Agencia</FormLabel>
                                    <Select
                                        // Mapeo seguro a número para evitar BadRequest en Entity Framework
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
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

                        {/* Campo: Seleccionar Estado */}
                        <FormField
                            control={form.control}
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

                    {/* Botones de acción inferiores */}
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
};