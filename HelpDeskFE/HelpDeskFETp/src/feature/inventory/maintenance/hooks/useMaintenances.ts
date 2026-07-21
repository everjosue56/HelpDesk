import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getMaintenance } from "../../../../api/generated/maintenance/maintenance";
import type { 
  CreateMaintenanceDto, 
  UpdateMaintenanceDto, 
  RenewMaintenanceDto,
  GetApiMaintenancesParams 
} from "../../../../api/model";

export interface MaintenanceItem {
  id: number;
  details: string;
  notificationDate: string;
  completionDate: string;
  executionTime: number;
  idMaintenanceType: number;
  maintenanceTypeName: string;
  idMaintenanceFrequency: number;
  frequencyName: string;
  idArea: number;
  areaName: string;
  idDevice: number;
  deviceCode: string;
  deviceBrand: string;
  deviceFullDescription: string;
  createdDate: string;
}

// 🚀 Tipo para los eventos del calendario
export interface MaintenanceCalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  details?: string;
  deviceName?: string;
  frequencyName?: string;
}

export const useMaintenances = (
  keyword: string,
  page: number,
  pageSize: number = 5,
  idMaintenanceType?: number | null,
  idArea?: number | null,
  idDevice?: number | null,
  idFrequency?: number | null,
  dateFrom?: string | null,
  dateTo?: string | null
) => {
  const { isAuthenticated } = useAuth();
  
  const [maintenances, setMaintenances] = useState<MaintenanceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [maintenance, setMaintenance] = useState<MaintenanceItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  void idFrequency;

  // Inicializar el servicio Orval
  const maintenanceService = useMemo(() => getMaintenance(AXIOS_INSTANCE), []);

  // 1. Obtener listado paginado
  const fetchMaintenances = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const params: GetApiMaintenancesParams = {
        PageNumber: page,
        PageSize: pageSize,
        Keyword: keyword || undefined,
        IdMaintenanceType: idMaintenanceType || undefined,
        IdArea: idArea || undefined,
        IdDevice: idDevice || undefined,
        DateFrom: dateFrom || undefined,
        DateTo: dateTo || undefined,
      };

      const response = await maintenanceService.getApiMaintenances(params);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || [];
      const serverTotalItems = backendResponse?.totalItems || 0;

      const formattedData: MaintenanceItem[] = Array.isArray(rawData)
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? rawData.map((item: any) => ({
            id: item.id || 0,
            details: item.details || "Sin detalles",
            notificationDate: item.notificationDate || "",
            completionDate: item.completionDate || "",
            executionTime: item.executionTime || 0,
            idMaintenanceType: item.idMaintenanceType || 0,
            maintenanceTypeName: item.maintenanceTypeName || "N/A",
            idArea: item.idArea || 0,
            areaName: item.areaName || "N/A",
            idMaintenanceFrequency: item.idMaintenanceFrequency ?? item.idFrequency ?? 0,
            frequencyName: item.frequencyName || "N/A",
            idDevice: item.idDevice || 0,
            deviceCode: item.deviceCode || "N/A",
            deviceBrand: item.deviceBrand || "N/A",
            deviceFullDescription: item.deviceFullDescription || "N/A",
            createdDate: item.createdDate  || "N/A"
          }))
        : [];

      setMaintenances(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al cargar mantenimientos mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, keyword, page, pageSize, idMaintenanceType, idArea, idDevice, dateFrom, dateTo, maintenanceService]);

  // 2. Obtener un mantenimiento individual
  const getMaintenanceById = useCallback(async (id: number): Promise<MaintenanceItem | null> => {
    try {
      setIsFetching(true);
      const response = await maintenanceService.getApiMaintenancesId(id);
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const item = backendResponse?.data || backendResponse;

      if (!item) {
        setMaintenance(null);
        return null;
      }

      const formatted: MaintenanceItem = {
        id: item.id || 0,
        details: item.details || "",
        notificationDate: item.notificationDate || "",
        completionDate: item.completionDate || "",
        executionTime: item.executionTime || 0,
        idMaintenanceType: item.idMaintenanceType || 0,
        maintenanceTypeName: item.maintenanceTypeName || "",
        idArea: item.idArea || 0,
        areaName: item.areaName || "",
        idMaintenanceFrequency: item.idMaintenanceFrequency ?? item.idFrequency ?? 0,
        frequencyName: item.frequencyName || "N/A",
        idDevice: item.idDevice || 0,
        deviceCode: item.deviceCode || "",
        deviceBrand: item.deviceBrand || "",
        deviceFullDescription: item.deviceFullDescription || "",
        createdDate: item.createdDate || ""
      };

      setMaintenance(formatted);
      return formatted;
    } catch (error) {
      console.error(`Error al obtener detalle del mantenimiento ${id}:`, error);
      setMaintenance(null);
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [maintenanceService]);

  // 3. Obtener eventos para la vista de Calendario
  const getMaintenanceCalendar = useCallback(async (year?: number, month?: number): Promise<MaintenanceCalendarEvent[]> => {
    try {
      const response = await AXIOS_INSTANCE.get('/api/maintenances/calendar', {
        params: { year, month }
      });
    
      return response.data?.data || [];
    } catch (error) {
      console.error("Error al obtener el calendario de mantenimientos:", error);
      return [];
    }
  }, []);

  // 4. Mutaciones CRUD y Acciones Especiales
  const createMaintenance = async (dto: CreateMaintenanceDto) => {
    try {
      setIsLoading(true);
      await maintenanceService.postApiMaintenances(dto);
      await fetchMaintenances();
    } catch (error) {
      console.error("Error al registrar mantenimiento:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMaintenance = async (id: number, dto: UpdateMaintenanceDto) => {
    try {
      setIsLoading(true);
      await maintenanceService.putApiMaintenancesId(id, dto);
      await fetchMaintenances();
    } catch (error) {
      console.error("Error al actualizar mantenimiento:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 Función para renovar el mantenimiento (Mismo ID, guarda historial y recalcula alertas)
  const renewMaintenance = async (id: number, dto: RenewMaintenanceDto) => {
    try {
      setIsLoading(true);
      await maintenanceService.postApiMaintenancesIdRenew(id, dto);
      await fetchMaintenances();
    } catch (error) {
      console.error("Error al renovar mantenimiento:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMaintenance = async (id: number) => {
    try {
      setIsLoading(true);
      await maintenanceService.deleteApiMaintenancesId(id);
      await fetchMaintenances();
    } catch (error) {
      console.error("Error al eliminar mantenimiento:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto reactivo 
  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      if (isMounted) await fetchMaintenances();
    };

    const timeoutId = setTimeout(executeFetch, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchMaintenances]);

  return {
    maintenances,
    totalCount,
    isLoading,
    maintenance,
    isFetching,
    getMaintenanceById,
    getMaintenanceCalendar,
    createMaintenance,
    updateMaintenance,
    renewMaintenance,
    deleteMaintenance,
    refresh: fetchMaintenances,
  };
};