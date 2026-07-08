import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Tag } from 'lucide-react';
import { Input } from '../../../../@/components/ui/input';
import { Button } from '../../../../@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../../@/components/ui/form';
import { useSupportCatalogs } from '../hooks/useSupportCatalogs';
import { useAreas } from '../../../administrative/areas/hooks/useAreas';
import { useSoftwareSystems } from '../../softwareSystem/hooks/useSoftwareSystems';
import { useTypeErrors } from '../../typeError/hooks/useTypeErrors';
//import { useUsers } from '../../../administrative/users/hooks/useUser';

export interface TicketFormValues {
    description: string;
    idArea: string;
    idSoftwareSystem: string;
    idTypeError: string;
    idImpact: string;
    idPriority: string;
    idUser: string;
    isActive: string;
}

interface TicketFormProps {
    initialData?: (TicketFormValues & { id?: number }) | null;
    onSubmit: (data: TicketFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const TicketForm: React.FC<TicketFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;

    // Consumo unificado de datos relacionales
    const { priorities, impacts, isLoadingCatalogs } = useSupportCatalogs();
    const { areas, isLoading: isLoadingAreas } = useAreas('', '', 1, 100);
    const { systems, isLoading: isLoadingSystems } = useSoftwareSystems('', 1, 100);
    const { typeErrors, isLoading: isLoadingTypes } = useTypeErrors('', 1, 100);
    // const { users, isLoading: isLoadingUsers } = useUsers('', null, null, null, null, 1, 100);

    const form = useForm<TicketFormValues>({
        mode: 'onBlur',
        defaultValues: {
            description: '',
            idArea: '',
            idSoftwareSystem: '',
            idTypeError: '',
            idImpact: '',
            idPriority: '',
            idUser: '',
            isActive: '1',
        },
    });

    useEffect(() => {
        if (
            initialData &&
            priorities?.length > 0 &&
            impacts?.length > 0 &&
            areas?.length > 0 &&
            systems?.length > 0 &&
            typeErrors?.length > 0
            //users?.length > 0
        ) {
            form.reset({
                description: initialData.description || '',
                idArea: initialData.idArea ? String(initialData.idArea) : '',
                idSoftwareSystem: initialData.idSoftwareSystem ? String(initialData.idSoftwareSystem) : '',
                idTypeError: initialData.idTypeError ? String(initialData.idTypeError) : '',
                idImpact: initialData.idImpact ? String(initialData.idImpact) : '',
                idPriority: initialData.idPriority ? String(initialData.idPriority) : '',
                idUser: initialData.idUser ? String(initialData.idUser) : '',
                isActive: initialData.isActive ? String(initialData.isActive) : '1',
            });
        }
    }, [initialData, form, priorities, impacts, areas, systems, typeErrors]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left select-none">

            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <Tag className="h-6 w-6 text-[#1a558b]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Ticket' : 'Nuevo Ticket'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode
                            ? 'Modifica los campos necesarios para actualizar la incidencia.'
                            : 'Completa el formulario para registrar una nueva incidencia.'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                        {/* 1. Descripción */}
                        <FormField
                            control={form.control}
                            name="description"
                            rules={{ required: 'La descripción es obligatoria.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Descripción</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. No hay internet en mi area"
                                            {...field}
                                            className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 text-xs placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* 2. Impacto */}
                        <FormField
                            control={form.control}
                            name="idImpact"
                            rules={{ required: 'El impacto es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Impacto</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""} disabled={isLoadingCatalogs}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none text-xm">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200 text-xs">
                                            {impacts.map(i => (
                                                <SelectItem key={i.id} value={String(i.id)} className="cursor-pointer">{i.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* 3. Seleccione una Área */}
                        <FormField
                            control={form.control}
                            name="idArea"
                            rules={{ required: 'El área es obligatoria.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Seleccione una Área</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""} disabled={isLoadingAreas}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none text-xm">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200 text-xs">
                                            {areas?.map(a => (
                                                <SelectItem key={a.id} value={String(a.id)} className="cursor-pointer">{a.nameArea}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* 4. Prioridad */}
                        <FormField
                            control={form.control}
                            name="idPriority"
                            rules={{ required: 'La prioridad es obligatoria.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Prioridad</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""} disabled={isLoadingCatalogs}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none text-xm">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200 text-xs">
                                            {priorities.map(p => (
                                                <SelectItem key={p.id} value={String(p.id)} className="cursor-pointer">{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* 5. Seleccione un Sistema */}
                        <FormField
                            control={form.control}
                            name="idSoftwareSystem"
                            rules={{ required: 'El sistema afectado es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Seleccione un Sistema</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""} disabled={isLoadingSystems}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none text-xm">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200 text-xs">
                                            {systems?.map(s => (
                                                <SelectItem key={s.id} value={String(s.id)} className="cursor-pointer">{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* 6. Tipo de Error */}
                        <FormField
                            control={form.control}
                            name="idTypeError"
                            rules={{ required: 'El tipo de error es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Tipo de Error</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""} disabled={isLoadingTypes}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none text-xm">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200 text-xs">
                                            {typeErrors?.map(te => (
                                                <SelectItem key={te.id} value={String(te.id)} className="cursor-pointer">{te.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />
                        {/* 8. Estado */}
                        <FormField
                            control={form.control}
                            name="isActive"
                            rules={{ required: 'El estado es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Estado</FormLabel>
                                    <div className={!isEditMode ? "pointer-events-none opacity-60" : ""}>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ? String(field.value) : "1"}
                                        >
                                            <FormControl>

                                                <SelectTrigger className={`rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full shadow-none text-xm ${!isEditMode ? 'bg-neutral-50 text-neutral-400' : 'bg-white'}`}>
                                                    <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white rounded-xl border border-gray-200 text-xs">
                                                <SelectItem value="1" className="cursor-pointer">Abierto</SelectItem>
                                                <SelectItem value="2" className="cursor-pointer">Resuelto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={onCancel}
                            variant="outline"
                            className="rounded-xl h-11 px-6 font-semibold bg-gray-400 hover:bg-gray-500 text-white hover:text-white border-none transition-colors gap-2 cursor-pointer shadow-none text-xs"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl h-11 px-6 font-semibold bg-[#1a558b] hover:bg-[#133f67] text-white transition-colors gap-2 shadow-none cursor-pointer text-xs"
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