import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { FiSettings } from 'react-icons/fi'; 
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

export interface TypeMaintenanceFormValues {
    name: string;
    estimatedTime: string | number; 
}

interface TypeMaintenanceFormProps {
    initialData?: (TypeMaintenanceFormValues & { id?: number }) | null;
    onSubmit: (data: TypeMaintenanceFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const TypeMaintenanceForm: React.FC<TypeMaintenanceFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;

    const form = useForm<TypeMaintenanceFormValues>({
        mode: 'onBlur', 
        defaultValues: {
            name: '',
            estimatedTime: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                estimatedTime: initialData.estimatedTime ?? '',
            });
        }
    }, [initialData, form]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left select-none">

            {/* Encabezado del Formulario */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <FiSettings className="h-6 w-6 text-[#1a558b]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Tipo de Mantenimiento' : 'Nuevo Tipo de Mantenimiento'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode
                            ? 'Modifica las especificaciones de tiempo o nombre para la tarea de mantenimiento'
                            : 'Registra una nueva categoría de mantenimiento técnico con su tiempo estimado de resolución'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                        {/* Campo: Nombre del Mantenimiento */}
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{
                                required: 'El nombre del tipo de mantenimiento es obligatorio.',
                                maxLength: { value: 100, message: 'El nombre no puede exceder los 100 caracteres.' }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Nombre del Mantenimiento</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Ej. Limpieza Física, Cambio de Pasta Térmica" 
                                            {...field} 
                                            className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400  placeholder:text-gray-400 placeholder:font-normal" 
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Tiempo Estimado en Minutos */}
                        <FormField
                            control={form.control}
                            name="estimatedTime"
                            rules={{
                                required: 'El tiempo estimado es obligatorio.',
                                validate: (value) => Number(value) > 0 || 'El tiempo estimado debe ser mayor a 0 minutos.'
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Tiempo Estimado (Minutos)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number"
                                            placeholder="Ej. 30, 65, 120" 
                                            {...field} 
                                            className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400  placeholder:text-gray-400 placeholder:font-normal" 
                                        />
                                    </FormControl>
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
                            className="rounded-xl h-11 px-6 font-semibold bg-gray-400 hover:bg-gray-500 text-white hover:text-white border-none transition-colors gap-2 cursor-pointer shadow-none"
                        >
                            <X className="h-4 w-4" />
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl h-11 px-6 font-semibold bg-[#1a558b] hover:bg-[#133f67] text-white transition-colors gap-2 shadow-none cursor-pointer"
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