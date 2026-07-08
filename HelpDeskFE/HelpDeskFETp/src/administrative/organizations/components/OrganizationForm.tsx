import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../../@/components/ui/form";
import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import { X, Save, Building2 } from 'lucide-react';
import type { OrganizationItem } from '../hooks/useOrganizations';


const organizationSchema = z.object({
    name: z.string().min(1, { message: "El nombre es obligatorio" }),
    contact: z.string().min(1, { message: "El contacto o teléfono es obligatorio" }),
    address: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface OrganizationFormProps {
    initialData?: OrganizationItem | null;
    onSubmit: (data: OrganizationFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData;


    const form = useForm<OrganizationFormValues>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: '',
            contact: '',
            address: '',
            description: '',
            logo: '',
        },
    });

    // Resetear valores dinámicamente al cargar la data
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                contact: initialData.contact || '',
                address: initialData.address || '',
                description: initialData.description || '',
                logo: initialData.logo || '',
            });
        }
    }, [initialData, form]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn w-full">

            {/* Encabezado Interno */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <Building2 className="h-6 w-6" />
                </div>
                <div className="text-left">
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? "Editar Organización" : "Nueva Organización"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode
                            ? "Modifica los campos necesarios para actualizar la organización"
                            : "Completa el formulario para registrar una nueva organización en el sistema"}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                    {/* Grid de Inputs de Dos Columnas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 w-full">

                        {/* Campo: Nombre de la Organización */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Nombre de la Organización</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. Organización Empresarial"
                                            {...field}
                                            className="rounded-xl border-gray-200 h-11 pl-4 text-slate-700 placeholder:text-slate-400/70"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Contacto */}
                        <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Contacto / Teléfono</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. 9578-2532"
                                            {...field}
                                            className="rounded-xl border-gray-200 h-11 pl-4 text-slate-700 placeholder:text-slate-400/70"
                                        />
                                    </FormControl>
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
                                        <Input
                                            placeholder="Ej. Torre Innovation, Piso 15"
                                            {...field}
                                            className="rounded-xl border-gray-200 h-11 pl-4 text-slate-700 placeholder:text-slate-400/70"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: URL Logo */}
                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">URL del Logo</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. https://example.com/logo.png"
                                            {...field}
                                            className="rounded-xl border-gray-200 h-11 pl-4 text-slate-700 placeholder:text-slate-400/70"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Descripción */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-sm font-bold text-slate-700">Descripción</FormLabel>
                                    <FormControl>
                                        <textarea
                                            placeholder="Escribe una breve descripción sobre la organización..."
                                            {...field}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-slate-700 placeholder:text-slate-400/70 focus:outline-none focus:border-gray-300 focus:ring-0 resize-none font-sans transition-all"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* Botones de acción alineados a la derecha */}
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