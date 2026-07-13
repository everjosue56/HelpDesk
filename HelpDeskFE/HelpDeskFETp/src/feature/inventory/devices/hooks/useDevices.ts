import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getDevice } from "../../../../api/generated/device/device"; 
import type { CreateDeviceDto, UpdateDeviceDto, GetApiDevicesParams } from "../../../../api/model";

export interface DeviceItem {
  id: number;
  quantity: number;
  brandName: string;      
  code: string;            
  observation: string;
  isActive: boolean;
  idDeviceType: number;
  deviceTypeName: string;  
  idUser: number;
  userName: string;        
  idArea: number;
  areaName: string;        
  createdDate?: string;
}

export const useDevices = (
  searchTerm: string,
  page: number,
  pageSize: number = 5,
  idUser?: number,
  idArea?: number,
  idDeviceType?: number
) => {
  const { isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [device, setDevice] = useState<DeviceItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const deviceService = useMemo(() => getDevice(AXIOS_INSTANCE), []);

  // 2. Obtener listado con el mapeo del JSON
  const fetchDevices = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const params: GetApiDevicesParams = {
        PageNumber: page,
        PageSize: pageSize,
        SearchTerm: searchTerm || undefined, 
        IdUser: idUser || undefined,       
        IdArea: idArea || undefined,       
        IdDeviceType: idDeviceType || undefined, 
      };

      const response = await deviceService.getApiDevices(params);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || [];
      const serverTotalItems = backendResponse?.totalItems || 0;

      const formattedData: DeviceItem[] = Array.isArray(rawData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? rawData.map((item: any) => ({
            id: item.id || 0,
            quantity: item.quantity || 1,
            brandName: item.brandName || "Sin Especificar",
            code: item.code || "N/A",
            observation: item.observation || "",
            isActive: item.isActive ?? true,
            idDeviceType: item.idDeviceType || 0,
            deviceTypeName: item.deviceTypeName || "N/A",
            idUser: item.idUser || 0,
            userName: item.userName || "Sin Asignar",
            idArea: item.idArea || 0,
            areaName: item.areaName || "N/A",
            createdDate: item.createdDate,
          }))
        : [];

      setDevices(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al cargar dispositivos filtrados mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }

  }, [isAuthenticated, searchTerm, page, pageSize, idUser, idArea, idDeviceType, deviceService]);

  // 3. Obtener un dispositivo individual por ID 
  const getDeviceById = useCallback(async (id: number): Promise<DeviceItem | null> => {
    try {
      setIsFetching(true);
      const response = await deviceService.getApiDevicesId(id);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const item = backendResponse?.data || backendResponse;

      if (!item) {
        setDevice(null);
        return null;
      }

      const formatted: DeviceItem = {
        id: item.id || 0,
        quantity: item.quantity || 1,
        brandName: item.brandName || "",
        code: item.code || "",
        observation: item.observation || "",
        isActive: item.isActive ?? true,
        idDeviceType: item.idDeviceType || 0,
        deviceTypeName: item.deviceTypeName || "",
        idUser: item.idUser || 0,
        userName: item.userName || "",
        idArea: item.idArea || 0,
        areaName: item.areaName || "",
        createdDate: item.createdDate,
      };

      setDevice(formatted);
      return formatted;
    } catch (error) {
      console.error(`Error al obtener detalle del dispositivo ${id}:`, error);
      setDevice(null);
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [deviceService]);

  // 4. Mutaciones CRUD
  const createDevice = async (dto: CreateDeviceDto) => {
    try {
      setIsLoading(true);
      await deviceService.postApiDevices(dto);
      await fetchDevices();
    } catch (error) {
      console.error("Error al registrar dispositivo:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDevice = async (id: number, dto: UpdateDeviceDto) => {
    try {
      setIsLoading(true);
      await deviceService.putApiDevicesId(id, dto);
      await fetchDevices();
    } catch (error) {
      console.error("Error al actualizar dispositivo:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDevice = async (id: number) => {
    try {
      setIsLoading(true);
      await deviceService.deleteApiDevicesId(id);
      await fetchDevices();
    } catch (error) {
      console.error("Error al dar de baja el dispositivo:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
  let isMounted = true;
  
  const executeFetch = async () => {
    if (isMounted) {
      await fetchDevices();
    }
  };

  const timeoutId = setTimeout(executeFetch, 300);
  return () => {
    isMounted = false;
    clearTimeout(timeoutId);
  };
}, [fetchDevices]);

  return {
    devices,
    totalCount,
    isLoading,
    device,
    isFetching,
    getDeviceById,
    createDevice,
    updateDevice,
    deleteDevice,
    refresh: fetchDevices,
  };
};