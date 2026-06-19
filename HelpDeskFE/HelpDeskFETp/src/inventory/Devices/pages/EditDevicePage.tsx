import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDevices } from '../hooks/useDevices';
import { DeviceForm, type DeviceFormValues } from '../components/DeviceForm';
import { toast } from "sonner";

export const EditDevicePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { getDeviceById, updateDevice, isLoading } = useDevices('', 1, 5);

    const [deviceData, setDeviceData] = useState<DeviceFormValues & { id: number } | null>(null);
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
    const loadDevice = async () => {
        if (!id) return;
        try {
            setIsFetchingData(true);
            const result = await getDeviceById(Number(id));
            
            if (result) {
                console.log("Respuesta cruda del backend:", result);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deviceTypeId = result.idDeviceType || (result as any).deviceTypeId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = result.idUser || (result as any).userId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const areaId = result.idArea || (result as any).areaId;
                setDeviceData({
                  id: result.id,
        code: result.code || '',
        brandName: result.brandName || '',
        quantity: result.quantity ?? 1,
        idDeviceType: deviceTypeId ? String(deviceTypeId) : '', 
        idUser: userId ? String(userId) : '',                   
        idArea: areaId ? String(areaId) : '',                   
        observation: result.observation || '',
        isActive: result.isActive ?? true
                });
            } else {
                toast.error("No se localizó el activo solicitado");
                navigate('/dashboard/device');
            }
        } catch (error) {
            console.error("Error al cargar dispositivo para actualización:", error);
        } finally {
            setIsFetchingData(false);
        }
    };

    loadDevice();
}, [id, getDeviceById, navigate]);

    const handleSubmit = async (values: DeviceFormValues) => {
        if (!id) return;
        try {
            await updateDevice(Number(id), {
                code: values.code,
                brandName: values.brandName,
                quantity: Number(values.quantity),
                idDeviceType: Number(values.idDeviceType),
                idUser: Number(values.idUser),
                idArea: Number(values.idArea),
                observation: values.observation || "",
                isActive: values.isActive
            });

            toast.success("Registro de inventario actualizado con éxito");
            navigate('/dashboard/device');
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar cambios en el hardware");
        }
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">
            {/* Breadcrumbs e Historial Superior */}
            <div className="flex flex-col gap-0.5">
                <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
                    <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inventario</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span onClick={() => navigate('/dashboard/device')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Dispositivos</span>
                    <span className="text-neutral-300 font-normal">&gt;</span>
                    <span className="text-gray-400 font-semibold">Editar</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Dispositivos</h1>
            </div>

            {isFetchingData ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-medium text-gray-400 animate-pulse">
                    Sincronizando ficha con la base de datos...
                </div>
            ) : (
                <DeviceForm
                    initialData={deviceData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/dashboard/device')}
                    isSubmitting={isLoading}
                />
            )}
        </div>
    );
};