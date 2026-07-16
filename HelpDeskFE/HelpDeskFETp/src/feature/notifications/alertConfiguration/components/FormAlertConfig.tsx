import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { X, Save, BellRing } from 'lucide-react';
import { Input } from '../../../../../@/components/ui/input';
import { Button } from '../../../../../@/components/ui/button';
//import { useAlertTypes } from '../../alertType/hooks/useAlertTypes';
import { useAreas } from '../../../administrative/areas/hooks/useAreas';
import { useAgencies } from '../../../administrative/agencies/hooks/useAgencies';
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
import { useAlertTypes } from '../../alertType/hooks/useAlertTypes';

export interface AlertConfigFormValues {
    title: string;
    subject: string;
    description: string;
    isGlobal: boolean;
    isActive: boolean;
    idArea: string | number | null;
    idAgency: string | number | null;
    scheduledDate: string;
}

interface AlertConfigFormProps {
    initialData?: AlertConfigFormValues & { id?: number } | null;
    onSubmit: (data: AlertConfigFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const AlertConfigForm: React.FC<AlertConfigFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;

    const { agencies } = useAgencies('', '', 1, 100);
    const { areas } = useAreas('', '', 1, 100);
    const { alertTypes } = useAlertTypes('', 1, 100);

    const form = useForm<AlertConfigFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        shouldFocusError: true,
        defaultValues: {
            title: '',
            subject: '',
            description: '',
            isGlobal: false,
            isActive: true,
            idArea: null,
            idAgency: null,
            scheduledDate: '',
        },
    });

    // Verificamos el estado global para mostrar o ocultar los selects de area y agencia 
    const isGlobalWatch = useWatch({
        control: form.control,
        name: 'isGlobal'
    });

    // Sincronizar y resetear valores en modo edición
    useEffect(() => {
        const isAlertTypesLoaded = alertTypes?.length > 0;
        const catalogsLoaded = initialData?.isGlobal || (areas?.length > 0 && agencies?.length > 0);

        if (initialData && isAlertTypesLoaded && catalogsLoaded) {
            form.reset({
                title: initialData.title || '',
                subject: initialData.subject || '',
                description: initialData.description || '',
                isGlobal: initialData.isGlobal ?? false,
                isActive: initialData.isActive ?? true,
                idArea: initialData.idArea ? String(initialData.idArea) : '',
                idAgency: initialData.idAgency ? String(initialData.idAgency) : '',
                scheduledDate: initialData.scheduledDate || '',
            });
        }
    }, [initialData, form, areas, agencies, alertTypes]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left">

            {/* Encabezado */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5 select-none">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <BellRing className="h-6 w-6 text-[#1a558b]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Configuración de Alerta' : 'Nueva Configuración de Alerta'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode
                            ? 'Modifique las reglas y la segmentación del disparador automático automatizado'
                            : 'Configure las variables esenciales para automatizar notificaciones por correo e In-App'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                        {/* Campo: Título de la Alerta */}
                        <FormField
                            control={form.control}
                            name="title"
                            rules={{ required: 'El tipo de alerta es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Tipo / Título de Alerta</FormLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={field.onChange}
                                        value={field.value ?? ''}
                                        onOpenChange={(open) => {
                                            if (!open) field.onBlur();
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white">
                                                <SelectValue placeholder="Seleccione un Tipo de Alerta" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {alertTypes?.map((type) => (
                                                <SelectItem
                                                    key={type.id}
                                                    value={type.name}
                                                    className="cursor-pointer text-slate-700"
                                                >
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Asunto del Mensaje */}
                        <FormField
                            control={form.control}
                            name="subject"
                            rules={{ required: 'El asunto del mensaje es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Asunto del Correo / Alerta</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Recordatorio: Inicio de Mantenimiento Trimestral" {...field} className="rounded-xl border-gray-200 h-11 pl-5 placeholder:text-gray-400 placeholder:font-normal" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Descripción / Cuerpo Completo */}
                        <FormField
                            control={form.control}
                            name="description"
                            rules={{ required: 'El cuerpo del mensaje es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-sm font-bold text-slate-700">Cuerpo de la Notificación</FormLabel>
                                    <FormControl>
                                        <textarea
                                            placeholder="Escriba aquí la descripción o mensaje detallado que recibirá el usuario técnico..."
                                            {...field}
                                            className="w-full min-h-25 px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a558b]/20 focus:border-[#1a558b] text-sm text-slate-700 placeholder:text-gray-400 font-normal transition-all"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Fecha y Hora Programada */}
                        <FormField
                            control={form.control}
                            name="scheduledDate"
                            rules={{ required: 'La fecha de ejecución es obligatoria.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Fecha y Hora de Ejecución</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} className="rounded-xl border-gray-200 h-11 pl-5 text-slate-700 focus:ring-[#1a558b]" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Alcance de la Alerta */}
                        <FormField
                            control={form.control}
                            name="isGlobal"
                            rules={{ required: 'Seleccione el alcance de la alerta.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Alcance de la Alerta</FormLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={(val) => field.onChange(val === 'true')}
                                        value={String(field.value ?? false)}
                                        onOpenChange={(open) => {
                                            if (!open) field.onBlur();
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white">
                                                <SelectValue placeholder="Seleccionar Alcance" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            <SelectItem value="false" className="cursor-pointer">Específico (Por Agencia/Área)</SelectItem>
                                            <SelectItem value="true" className="cursor-pointer">Global (Toda la organización)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* SECCIÓN CONDICIONAL: SE RENDERIZA ÚNICAMENTE SI NO ES GLOBAL */}
                        {!isGlobalWatch && (
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 bg-slate-50/60 p-6 rounded-2xl border border-slate-100/80 animate-fadeIn mt-2">

                                {/* Campo: Agencia Relacionada */}
                                <FormField
                                    control={form.control}
                                    name="idAgency"
                                    rules={{
                                        validate: (value) => {
                                            if (isGlobalWatch) return true;
                                            return value !== null && value !== undefined && value !== ''
                                                ? true
                                                : 'Seleccione una agencia destino.';
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-bold text-slate-700">Agencia Destino</FormLabel>
                                            <Select
                                                name={field.name}
                                                onValueChange={(val) => field.onChange(val === 'null' ? null : Number(val))}
                                                value={field.value !== null && field.value !== undefined ? String(field.value) : "null"}
                                                onOpenChange={(open) => {
                                                    if (!open) field.onBlur();
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white">
                                                        <SelectValue placeholder="Seleccionar Agencia" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white rounded-xl border border-gray-200">
                                                    <SelectItem value="null" className="cursor-pointer text-neutral-400">No Aplica / Global</SelectItem>
                                                    {agencies.map(a => (
                                                        <SelectItem key={a.id} value={String(a.id)} className="cursor-pointer">{a.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs text-red-500 font-medium" />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo: Área Relacionada */}
                                <FormField
                                    control={form.control}
                                    name="idArea"
                                    rules={{
                                        validate: (value) => {
                                            if (isGlobalWatch) return true;
                                            return value !== null && value !== undefined && value !== ''
                                                ? true
                                                : 'Seleccione un área técnica destino.';
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-bold text-slate-700">Área Técnica Destino</FormLabel>
                                            <Select
                                                name={field.name}
                                                onValueChange={(val) => field.onChange(val === 'null' ? null : Number(val))}
                                                value={field.value !== null && field.value !== undefined ? String(field.value) : "null"}
                                                onOpenChange={(open) => {
                                                    if (!open) field.onBlur();
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white">
                                                        <SelectValue placeholder="Seleccionar Área" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white rounded-xl border border-gray-200">
                                                    <SelectItem value="null" className="cursor-pointer text-neutral-400">No Aplica / Global</SelectItem>
                                                    {areas.map(a => (
                                                        <SelectItem key={a.id} value={String(a.id)} className="cursor-pointer">{a.nameArea}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs text-red-500 font-medium" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* Campo: Seleccionar Estado de Activación */}
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Estado de la Configuración</FormLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={(val) => field.onChange(val === 'true')}
                                        value={String(field.value ?? true)}
                                        onOpenChange={(open) => {
                                            if (!open) field.onBlur();
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white">
                                                <SelectValue placeholder="Seleccionar estado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            <SelectItem value="true" className="cursor-pointer">Activa</SelectItem>
                                            <SelectItem value="false" className="cursor-pointer">Inactiva</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* Botones de Acción Estilizados */}
                    <div className="flex items-center justify-end gap-4 pt-5 border-t border-gray-100 select-none">
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
                            {isSubmitting ? 'Guardando...' : 'Guardar Configuración'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};