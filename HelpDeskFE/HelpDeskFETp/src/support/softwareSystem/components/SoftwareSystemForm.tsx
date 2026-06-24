import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Database } from 'lucide-react';
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

export interface SoftwareSystemFormValues {
    name: string;
}

interface SoftwareSystemFormProps {
    initialData?: (SoftwareSystemFormValues & { id?: number }) | null; 
    onSubmit: (data: SoftwareSystemFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const SoftwareSystemForm: React.FC<SoftwareSystemFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;

    const form = useForm<SoftwareSystemFormValues>({
        mode: 'onBlur',
        defaultValues: {
            name: '',
        },
    });
 
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
            });
        }
    }, [initialData, form]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left select-none">

            {/* Cabecera  */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <Database className="h-6 w-6 text-[#1a558b]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Sistema Afectado' : 'Nuevo Sistema Afectado'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode
                            ? 'Modifica el campo necesario para actualizar la plataforma o software registrado'
                            : 'Completa el campo para registrar un nuevo sistema o entorno de software en el catálogo'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                        {/* Campo: Nombre del Sistema */}
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{
                                required: 'El nombre del sistema afectado es obligatorio.',
                                maxLength: { value: 100, message: 'El nombre no puede exceder los 100 caracteres.' }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Nombre del Sistema</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Ej. Correo Institucional y Suite Office" 
                                            {...field} 
                                            className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal" 
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* Botones de acción estándar */}
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