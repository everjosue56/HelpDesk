import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Wrench } from 'lucide-react';
import { Input } from '../../../../@/components/ui/input';
import { Button } from '../../../../@/components/ui/button';
import { Textarea } from '../../../../@/components/ui/textarea';
import { useAreas } from '../../../administrative/areas/hooks/useAreas';
import { useDevices } from '../../devices/hooks/useDevices';
import { useTypeMaintenance } from '../../typeMaintenance/hooks/useTypeMaintenance'; 
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../../@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../@/components/ui/select';

export interface MaintenanceFormValues {
    idMaintenanceType: string | number | null;
    idArea: string | number | null;
    idDevice: string | number | null;
    notificationDate: string;
    completionDate: string;
    details: string;
    executionTime: number;
}

interface MaintenanceFormProps {
    initialData?: (MaintenanceFormValues & { id?: number }) | null;
    onSubmit: (data: MaintenanceFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;

    // Consumo de datos de catálogos relacionales para poblar los combos
    const { devices } = useDevices('', 1, 100);
    const { areas } = useAreas('', '', 1, 100);
    const { typeMaintenance } = useTypeMaintenance('', 1, 100); 

    const form = useForm<MaintenanceFormValues>({
        mode: 'onBlur',
        defaultValues: {
            idMaintenanceType: undefined,
            idArea: '',
            idDevice: '',
            notificationDate: '',
            completionDate: '',
            details: '',
            executionTime: 0,
        },
    });

    // Sincronización asíncrona para el modo de edicion 
    useEffect(() => {
    if (initialData && devices?.length > 0 && areas?.length > 0 && typeMaintenance?.length > 0) {
        
        const formatForInput = (dateStr?: string) => {
            if (!dateStr || dateStr.startsWith('0001-01-01')) return '';
            return dateStr.substring(0, 16); 
        };

        form.reset({
            idMaintenanceType: initialData.idMaintenanceType ? String(initialData.idMaintenanceType) : '',
            idArea: initialData.idArea ? String(initialData.idArea) : '',
            idDevice: initialData.idDevice ? String(initialData.idDevice) : '',
            notificationDate: formatForInput(initialData.notificationDate),
            completionDate: formatForInput(initialData.completionDate),
            details: initialData.details || '',
            executionTime: initialData.executionTime ?? 0,
        });
    }
}, [initialData, form, devices, areas, typeMaintenance]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left select-none">
            
            {/* Encabezado del Formulario */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <Wrench className="h-6 w-6 text-[#1a558b]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Registro de Mantenimiento' : 'Registrar Nuevo Mantenimiento'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode 
                            ? 'Modifica los parámetros de la auditoría o tiempos de solución del hardware' 
                            : 'Documenta una nueva acción correctiva o preventiva realizada sobre un activo tecnológico'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        
                        {/* Selector: Tipo de Mantenimiento */}
                        <FormField
                            control={form.control}
                            name="idMaintenanceType"
                            rules={{ required: 'Debe seleccionar el tipo de mantenimiento.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Tipo de Mantenimiento</FormLabel>
                                    <Select 
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {typeMaintenance?.map(t => (
                                                <SelectItem key={t.id} value={String(t.id)} className="cursor-pointer">
                                                    {t.name || t.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Selector: Dispositivo de Hardware */}
                        <FormField
                            control={form.control}
                            name="idDevice"
                            rules={{ required: 'Debe vincular el dispositivo afectado.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Dispositivo</FormLabel>
                                    <Select 
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder="Seleccionar Dispositivo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {devices?.map(d => (
                                                <SelectItem key={d.id} value={String(d.id)} className="cursor-pointer">
                                                    {d.brandName} ({d.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Selector: Área Relacionada */}
                        <FormField
                            control={form.control}
                            name="idArea"
                            rules={{ required: 'Debe seleccionar el área de procedencia.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Área Operativa</FormLabel>
                                    <Select 
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder="Seleccionar Área" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {areas?.map(a => (
                                                <SelectItem key={a.id} value={String(a.id)} className="cursor-pointer">
                                                    {a.nameArea || a.nameArea}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Tiempo Demorado / Minutos u Horas */}
                        <FormField
                            control={form.control}
                            name="executionTime"
                            rules={{ required: 'El tiempo de ejecución es obligatorio.', min: { value: 0, message: 'El tiempo no puede ser negativo.' } }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Tiempo Demorado (Minutos)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Fecha de Notificación */}
                        <FormField
                            control={form.control}
                            name="notificationDate"
                            rules={{ required: 'La fecha de notificación es obligatoria.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Fecha de Notificación</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} className="rounded-xl border-gray-200 h-11 px-5 focus-visible:ring-1 focus-visible:ring-neutral-400 text-slate-700" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Fecha de Realización */}
                        <FormField
                            control={form.control}
                            name="completionDate"
                            rules={{ required: 'La fecha de realización es obligatoria.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Fecha Realizado</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} className="rounded-xl border-gray-200 h-11 px-5 focus-visible:ring-1 focus-visible:ring-neutral-400 text-slate-700" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Detalles del Mantenimiento */}
                        <div className="md:col-span-2">
                            <FormField
                                control={form.control}
                                name="details"
                                rules={{ required: 'Debe ingresar los detalles o hallazgos técnicos del mantenimiento.' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-700">Detalles técnicos</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Ej: Limpieza física de ventiladores y cambio de pasta térmica..." {...field} className="rounded-xl border-gray-200 pl-5 min-h-24 focus-visible:ring-1 focus-visible:ring-neutral-400 leading-relaxed placeholder:text-gray-400 placeholder:font-normal" />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500 font-medium" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Botones de Acción inferior */}
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