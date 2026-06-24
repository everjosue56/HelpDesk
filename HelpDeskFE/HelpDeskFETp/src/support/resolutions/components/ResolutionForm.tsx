import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Wrench } from 'lucide-react';
import { Input } from '../../../../@/components/ui/input';
import { Button } from '../../../../@/components/ui/button';
import { useSupportCatalogs } from '../../tickets/hooks/useSupportCatalogs';
import { useDevices } from '../../../inventory/devices/hooks/useDevices';
import { AXIOS_INSTANCE } from '../../../api/axios-instance';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../../@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../@/components/ui/select';
import { useSolutionStatuses } from '@/support/solutionState/useSolutionStatuses';

export interface ResolutionFormValues {
    idTicket: number | string;
    actionTaken: string;
    rootCause: string;
    preventiveMeasures: string;
    observation: string;
    secondObservation: string;
    idSolutionStatus: string | number;
    idPriority: string | number;
    idDevice: string | number | null;
    solutionTimeHours: number | string;
}

interface ResolutionFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: (any & { id?: number }) | null;
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (payload: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const ResolutionForm: React.FC<ResolutionFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;

    // ─── ENDPOINTS RELACIONALES ───
    const [isLoadingStatuses, setIsLoadingStatuses] = useState(false);

    // Inyección de catálogos 
    const { priorities } = useSupportCatalogs();
    const { devices, isLoading: isLoadingDevices } = useDevices('', 1, 100);
    const { solutionStatuses } = useSolutionStatuses();

    const form = useForm<ResolutionFormValues>({
        mode: 'onBlur',
        defaultValues: {
            idTicket: '',
            actionTaken: '',
            rootCause: '',
            preventiveMeasures: '',
            observation: '',
            secondObservation: '',
            idSolutionStatus: '',
            idPriority: '',
            idDevice: '',
            solutionTimeHours: '',
        },
    });

    // 1. Cargar catálogo
    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                setIsLoadingStatuses(true);
                const response = await AXIOS_INSTANCE.get('/api/solution-statuses');
                const resData = response.data?.data || response.data?.Data || response.data || [];
                setIsLoadingStatuses(resData);
            } catch (error) {
                console.error("Error cargando los estados de solución:", error);
            } finally {
                setIsLoadingStatuses(false);
            }
        };
        fetchStatuses();
    }, []);

    useEffect(() => {
       const isCatalogReady = priorities?.length && devices?.length && solutionStatuses?.length;

    if (initialData && isCatalogReady) {
        form.reset({
            idTicket: initialData.idTicket ?? '',
            actionTaken: initialData.actionTaken || '',
            rootCause: initialData.rootCause || '',     
            preventiveMeasures: initialData.preventiveMeasures || '',
            observation: initialData.observation || '',
            secondObservation: initialData.secondObservation || '',
            idSolutionStatus: initialData.idSolutionStatus ? String(initialData.idSolutionStatus) : '',
            idPriority: initialData.idPriority ? String(initialData.idPriority) : '',
            idDevice: initialData.idDevice ? String(initialData.idDevice) : '',
            solutionTimeHours: initialData.solutionTime ? Number(initialData.solutionTime / 60) : '',
        });
    }
}, [initialData, form, priorities, devices, solutionStatuses]);

    const handleLocalSubmit = (values: ResolutionFormValues) => {
        const processedPayload = {
            ...values,
            idTicket: Number(values.idTicket),
            idSolutionStatus: Number(values.idSolutionStatus),
            idPriority: Number(values.idPriority),
            idDevice: values.idDevice ? Number(values.idDevice) : null,
            solutionTime: Math.round(Number(values.solutionTimeHours) * 60)
        };
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (processedPayload as any).solutionTimeHours;
        onSubmit(processedPayload);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left select-none">

            {/* Encabezado */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <Wrench className="h-6 w-6 text-[#1a558b]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Resolución' : 'Registrar Nueva Resolución'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode ? 'Modifica los datos de la solución técnica aplicada' : 'Completa el formulario para registrar una nueva resolucion en la mesa de soporte'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLocalSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                        {/* ID del Ticket */}
                        <FormField
                            control={form.control}
                            name="idTicket"
                            rules={{ required: 'El número de ticket es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Número de Ticket</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Ej. 14" disabled={isEditMode} {...field} className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:bg-slate-50 placeholder:text-gray-400" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Acción Tomada */}
                        <FormField
                            control={form.control}
                            name="actionTaken"
                            rules={{ required: 'La acción tomada es obligatoria.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Acción Tomada</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Se reconfiguró el direccionamiento IP" {...field} className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Causa Raíz */}
                        <FormField
                            control={form.control}
                            name="rootCause"
                            rules={{ required: 'La causa raíz es obligatoria.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Problema Raíz / Causa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Conflicto de IP duplicada en el segmento" {...field} className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Medidas Preventivas */}
                        <FormField
                            control={form.control}
                            name="preventiveMeasures"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Medida Preventiva</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Reservar IPs estáticas en el DHCP Server" {...field} className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Observación */}
                        <FormField
                            control={form.control}
                            name="observation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Observación</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Notas adicionales del soporte" {...field} className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Segunda Observación */}
                        <FormField
                            control={form.control}
                            name="secondObservation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Segunda Observación</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Notas de seguimiento técnico" {...field} className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Selector: Estado de Solución  */}
                        <FormField
                            control={form.control}
                            name="idSolutionStatus"
                            rules={{ required: 'Debe seleccionar un estado operativo.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Estado de Solución</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder={isLoadingStatuses ? "Cargando estados..." : "Seleccionar"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {solutionStatuses?.map(s => (
                                                <SelectItem key={s.id} value={String(s.id)} className="cursor-pointer">
                                                    {s.name} {/* 🚀 Solo mapeamos id y name como viene del backend */}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Selector: Prioridad */}
                        <FormField
                            control={form.control}
                            name="idPriority"
                            rules={{ required: 'Debe seleccionar una prioridad.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Prioridad</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {priorities?.map(p => (
                                                <SelectItem key={p.id} value={String(p.id)} className="cursor-pointer">
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Selector: Dispositivo  */}
                        <FormField
                            control={form.control}
                            name="idDevice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Dispositivo Asociado</FormLabel>
                                    {/* Forzamos que si viene null/undefined o string vacío, use cadena vacía */}
                                    <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder={isLoadingDevices ? "Cargando hardware..." : "Seleccionar Hardware"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {devices?.map(d => (
                                                <SelectItem key={d.id} value={String(d.id)} className="cursor-pointer">
                                                    {d.brandName} - {d.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* input: Tiempo Tardado */}
                        <FormField
                            control={form.control}
                            name="solutionTimeHours"
                            rules={{
                                required: 'Debe ingresar el tiempo invertido.',
                                min: { value: 0.1, message: 'El tiempo debe ser mayor a 0.' }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Tiempo Invertido (Horas de Trabajo)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.25" // Permite saltos de 15 minutos en decimales (ej. 1.25, 2.50, 12, etc.)
                                            placeholder="Ej. 1.5 (Equivale a 1 Hora y 30 Minutos)"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal "
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* Botonera inferior */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                        <Button type="button" onClick={onCancel} variant="outline" className="rounded-xl h-11 px-6 font-semibold bg-gray-400 hover:bg-gray-500 text-white border-none cursor-pointer shadow-none">
                            <X className="h-4 w-4" /> Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="rounded-xl h-11 px-6 font-semibold bg-[#1a558b] hover:bg-[#133f67] text-white cursor-pointer shadow-none">
                            <Save className="h-4 w-4" /> {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};