import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "..//../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getTypeDevice } from "../../../../api/generated/type-device/type-device"; 
import type { CreateTypeDevicesDto, UpdateTypeDevicesDto } from "../../../../api/model"; 

export interface TypeDeviceItem {
  id: number;
  name: string;
  description: string;
  isActive?: boolean;
  createdDate?: string;
}

export const useTypeDevices = (
  searchTerm: string,
  page: number,
  pageSize: number = 5,
) => {
  const { isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<TypeDeviceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [device, setDevice] = useState<TypeDeviceItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // 1. Servicio generado por Orval 
  const deviceService = useMemo(() => getTypeDevice(AXIOS_INSTANCE), []);

  const fetchTypeDevices = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      // Usamos el contrato exacto de GetApiTypeDevicesParams
      const response = await deviceService.getApiTypeDevices({
        PageNumber: page,
        PageSize: pageSize,
        Name: searchTerm || undefined, 
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || [];
      const serverTotalItems = backendResponse?.totalItems || 0;

      const formattedData: TypeDeviceItem[] = Array.isArray(rawData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? rawData.map((item: any) => ({
            id: item.id || 0,
            name: item.name || "Sin Nombre",
            description: item.description || "Sin Descripción",
            isActive: item.isActive ?? true,
            createdDate: item.createdDate || "N/A",
          }))
        : [];

      setDevices(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al cargar tipos de dispositivos mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, searchTerm, page, pageSize, deviceService]);
  // 3. Obtener un registro individual por ID con Mapeo Seguro
  const getTypeDeviceById = useCallback(
    async (id: number): Promise<TypeDeviceItem | null> => {
      try {
        setIsFetching(true);
        const response = await deviceService.getApiTypeDevicesId(id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendResponse = response.data as any;
        const item = backendResponse?.data || backendResponse;

        if (!item) {
          setDevice(null);
          return null;
        }

        const formatted: TypeDeviceItem = {
          id: item.id || 0,
          name: item.name || "",
          description: item.description || "",
          createdDate: item.createdDate,
        };

        setDevice(formatted);
        return formatted;
      } catch (error) {
        console.error(`Error al obtener detalle de tipo de dispositivo ${id}:`, error);
        setDevice(null);
        return null;
      } finally {
        setIsFetching(false);
      }
    },
    [deviceService],
  );

  // 4. Mutaciones CRUD (POST, PUT, DELETE) 
  const createTypeDevice = async (dto: CreateTypeDevicesDto) => {
    try {
      setIsLoading(true);
      await deviceService.postApiTypeDevices(dto);
      await fetchTypeDevices(); 
    } catch (error) {
      console.error("Error al crear el tipo de dispositivo:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTypeDevice = async (id: number, dto: UpdateTypeDevicesDto) => {
    try {
      setIsLoading(true);
      await deviceService.putApiTypeDevicesId(id, dto);
      await fetchTypeDevices(); 
    } catch (error) {
      console.error("Error al actualizar el tipo de dispositivo:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTypeDevice = async (id: number) => {
    try {
      setIsLoading(true);
      await deviceService.deleteApiTypeDevicesId(id);
      await fetchTypeDevices();
    } catch (error) {
      console.error("Error al eliminar el tipo de dispositivo:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchTypeDevices();
      }
    };

    const timeoutId = setTimeout(executeFetch, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchTypeDevices]);

  return {
    devices,
    totalCount,
    isLoading,
    device,
    isFetching,
    getTypeDeviceById,
    createTypeDevice,
    updateTypeDevice,
    deleteTypeDevice, 
    refresh: fetchTypeDevices,
  };
};