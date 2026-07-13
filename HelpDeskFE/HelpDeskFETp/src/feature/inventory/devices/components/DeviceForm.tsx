import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Laptop } from 'lucide-react';
import { Input } from '../../../../../@/components/ui/input';
import { Button } from '../../../../../@/components/ui/button';
import { Textarea } from '../../../../../@/components/ui/textarea';
import { useAreas } from '../../../administrative/areas/hooks/useAreas';
import { useTypeDevices } from '../../typeDevices/hooks/useTypeDevices';
import { useUsers } from '../../../administrative/users/hooks/useUser';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../../../@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../@/components/ui/select';

export interface DeviceFormValues {
    quantity: number;
    brandName: string;
    code: string;
    idDeviceType: string | number | null;
    idUser: string | number | null;
    idArea: string | number | null;
    observation: string;
    isActive: boolean;
}

interface DeviceFormProps {
    initialData?: (DeviceFormValues & { id?: number }) | null;
    onSubmit: (data: DeviceFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const DeviceForm: React.FC<DeviceFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const isEditMode = !!initialData?.id;

    // Sincronizamos los hooks relacionales con límites amplios
    const { users } = useUsers('', null, null, null, null, 1, 100);
    const { areas } = useAreas('', '', 1, 100);
    const { devices: typeDevices } = useTypeDevices('', 1, 100);

    const form = useForm<DeviceFormValues>({
        mode: 'onBlur',
        defaultValues: {
            quantity: 1,
            brandName: '',
            code: '',
            idDeviceType: '',
            idUser: '',
            idArea: '',
            observation: '',
            isActive: true,
        },
    });

    useEffect(() => {

        if (initialData && users?.length && areas?.length && typeDevices?.length) {
            form.reset({
                quantity: initialData.quantity ?? 1,
                brandName: initialData.brandName || '',
                code: initialData.code || '',
                idDeviceType: initialData.idDeviceType ? String(initialData.idDeviceType) : '',
                idUser: initialData.idUser ? String(initialData.idUser) : '',
                idArea: initialData.idArea ? String(initialData.idArea) : '',
                observation: initialData.observation || '',
                isActive: initialData.isActive ?? true,
            });
        }
    }, [initialData, form, users, areas, typeDevices]);

    console.log("DEBUG CRUD - Estado actual:", {
        initialDataIdUser: initialData?.idUser,
        tipoDeInitialDataIdUser: typeof initialData?.idUser,
        primerUsuarioEnLista: users?.[0],
        listaUsuariosLongitud: users?.length
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left select-none">

            {/* Encabezado */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                    <Laptop className="h-6 w-6 text-[#1a558b]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Editar Dispositivo' : 'Registrar Nuevo Dispositivo'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isEditMode ? 'Modifica los datos técnicos o asignaciones del hardware' : 'Añade un nuevo activo tecnológico al inventario general'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                        {/* Código de Inventario */}
                        <FormField
                            control={form.control}
                            name="code"
                            rules={{ required: 'El código patrimonial es obligatorio.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Código de Inventario</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. FCSR-001" {...field} className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400  placeholder:text-gray-400 placeholder:font-normal" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Marca / Modelo */}
                        <FormField
                            control={form.control}
                            name="brandName"
                            rules={{ required: 'La marca y modelo son obligatorios.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Marca / Modelo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Dell Latitude 3420" {...field} className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400  placeholder:text-gray-400 placeholder:font-normal" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Cantidad */}
                        <FormField
                            control={form.control}
                            name="quantity"
                            rules={{ required: 'La cantidad es obligatoria.', min: { value: 1, message: 'Debe registrar al menos 1.' } }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Cantidad</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400  placeholder:text-gray-400 placeholder:font-normal" />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Selector: Tipo de Dispositivo */}
                        <FormField
                            control={form.control}
                            name="idDeviceType"
                            rules={{ required: 'Debe seleccionar un tipo de dispositivo.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Tipo de Dispositivo</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ? String(field.value) : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none  placeholder:text-gray-400 placeholder:font-normal">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {typeDevices?.map(t => (
                                                <SelectItem key={t.id} value={String(t.id)} className="cursor-pointer">
                                                    {t.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Selector: Usuario Asignado */}
                        <FormField
                            control={form.control}
                            name="idUser"
                            rules={{ required: 'Debe seleccionar un usuario responsable.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Usuario Asignado</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ? String(field.value) : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {users?.map(u => (
                                                <SelectItem key={u.id} value={String(u.id)} className="cursor-pointer">
                                                    {u.userName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Selector: Área Operativa */}
                        <FormField
                            control={form.control}
                            name="idArea"
                            rules={{ required: 'Debe vincular un área operativa.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Área Operativa</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ? String(field.value) : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            {areas?.map(a => (
                                                <SelectItem key={a.id} value={String(a.id)} className="cursor-pointer">
                                                    {a.nameArea}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Selector: Estado Operativo */}
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-700">Estado del Dispositivo</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(val === 'true')}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : "true"}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-gray-200 h-11 pl-5 pr-4 text-slate-700 focus:ring-[#1a558b] w-full bg-white shadow-none">
                                                <SelectValue placeholder="Seleccionar Estado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white rounded-xl border border-gray-200">
                                            <SelectItem value="true" className="cursor-pointer">Activo / Operativo</SelectItem>
                                            <SelectItem value="false" className="cursor-pointer">Inactivo / Baja</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* Observaciones Técnicas */}
                        <div className="md:col-span-2">
                            <FormField
                                control={form.control}
                                name="observation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-700">Observaciones Técnicas</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describa el estado físico, accesorios o detalles de entrega..." {...field} className="rounded-xl border-gray-200 pl-5 min-h-24 focus-visible:ring-1 focus-visible:ring-neutral-400  placeholder:text-gray-400 placeholder:font-normal" />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500 font-medium" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Botones */}
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