import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getMaintenance } from "../../../../api/generated/maintenance/maintenance";
import { getMaintenanceExport } from "../../../../api/generated/maintenance-export/maintenance-export";
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
  title?: string; 
}

export interface MaintenanceCalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  details?: string;
  deviceName?: string;
  frequencyName?: string;
  color?: string | null;
  status?: string | null;
}

export interface MaintenanceFrequencyItem {
  id: number;
  name: string;
  daysInterval: number;
  createdDate?: string;
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

  // Estado para el catálogo de Frecuencias de Mantenimiento
  const [frequencies, setFrequencies] = useState<MaintenanceFrequencyItem[]>([]);
  const [isLoadingFrequencies, setIsLoadingFrequencies] = useState<boolean>(false);

  void idFrequency;

  
  const maintenanceService = useMemo(() => getMaintenance(AXIOS_INSTANCE), []);
  const exportService = useMemo(() => getMaintenanceExport(AXIOS_INSTANCE), []);

  // 1. Obtener listado paginado de mantenimientos
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
            details: item.details || item.detail || item.description || item.observation || "Sin detalles",
            notificationDate: item.notificationDate || "",
            completionDate: item.completionDate || "",
            executionTime: item.executionTime || 0,
            idMaintenanceType: item.idMaintenanceType || 0,
            maintenanceTypeName: item.maintenanceTypeName || "N/A",
            idArea: item.idArea || 0,
            areaName: item.areaName || "N/A",
            idMaintenanceFrequency: item.idMaintenanceFrequency ?? item.idFrequency ?? 0,
            frequencyName: 
              item.frequencyName || 
              item.maintenanceFrequencyName || 
              item.maintenanceFrequency?.name || 
              item.frequency?.name || 
              "N/A",
            idDevice: item.idDevice || 0,
            deviceCode: item.deviceCode || "N/A",
            deviceBrand: item.deviceBrand || "N/A",
            deviceFullDescription: item.deviceFullDescription || "N/A",
            createdDate: item.createdDate || "N/A"
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

  // 2. Obtener catálogo de Frecuencias de Mantenimiento
  const fetchFrequencies = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoadingFrequencies(true);
      const response = await AXIOS_INSTANCE.get('/api/maintenance-frequencies');
  
      const rawData = response.data?.data || response.data || [];

      if (Array.isArray(rawData)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted: MaintenanceFrequencyItem[] = rawData.map((item: any) => ({
          id: item.id || 0,
          name: item.name || "Sin nombre",
          daysInterval: item.daysInterval || 0,
          createdDate: item.createdDate,
        }));
        setFrequencies(formatted);
      } else {
        setFrequencies([]);
      }
    } catch (error) {
      console.error("Error al obtener las frecuencias de mantenimiento:", error);
      setFrequencies([]);
    } finally {
      setIsLoadingFrequencies(false);
    }
  }, [isAuthenticated]);

  // 3. Obtener un mantenimiento individual por ID
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
        details: item.details || item.detail || item.description || item.observation || "",
        notificationDate: item.notificationDate || "",
        completionDate: item.completionDate || "",
        executionTime: item.executionTime || 0,
        idMaintenanceType: item.idMaintenanceType || 0,
        maintenanceTypeName: item.maintenanceTypeName || "",
        idArea: item.idArea || 0,
        areaName: item.areaName || "",
        idMaintenanceFrequency: item.idMaintenanceFrequency ?? item.idFrequency ?? 0,
        frequencyName: 
          item.title || 
          item.frequencyName || 
          item.maintenanceFrequencyName || 
          item.maintenanceFrequency?.name || 
          item.frequency?.name || 
          "N/A",
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

  // 4. Obtener eventos para la vista de Calendario
  const getMaintenanceCalendar = useCallback(async (year?: number, month?: number): Promise<MaintenanceCalendarEvent[]> => {
    try {
      const response = await AXIOS_INSTANCE.get('/api/maintenances/calendar', {
        params: { year, month }
      });
 
      const rawData = response.data?.data || response.data || [];

      if (!Array.isArray(rawData)) return [];

      return rawData.map((event: any) => ({
        id: event.id || 0,
        title: event.title || event.details || event.deviceName || "Mantenimiento Preventivo",
        start: event.start || event.notificationDate || "",
        end: event.end || event.completionDate || "",
        details: event.details || event.title || event.description || "Sin detalles adicionales",
        deviceName: event.deviceName || event.deviceCode || "Dispositivo N/A",
        frequencyName: 
          event.frequencyName || 
          event.maintenanceFrequencyName || 
          event.frequency?.name || 
          "N/A",
        color: event.color || null,
        status: event.status || null,
      }));

    } catch (error) {
      console.error("Error al obtener el calendario de mantenimientos:", error);
      return [];
    }
  }, []);

  // 5. Mutaciones CRUD y Acciones Especiales
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
 
  const downloadExcel = async () => {
    try {
      const response = await exportService.getApiMaintenancesExportExportExcel(
        {}, // Si tu endpoint en C# no exige filtros obligatorios pasa objeto vacío o los params de búsqueda
        {
          responseType: "blob",
        },
      );

      // Crear y forzar descarga del Blob binario (.xlsx)
      const blob = new Blob([response.data as unknown as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Nombre dinámico con la fecha del día (YYYYMMDD)
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

      link.setAttribute("download", `Historial_Mantenimientos_${dateStr}.xlsx`);

      document.body.appendChild(link);
      link.click();

      // Limpieza en memoria DOM
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar Excel desde el cliente de Orval:", error);
      throw error;
    }
  };
  
  // Efecto reactivo para refrescar datos al cambiar filtros
  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      if (isMounted) {
        await fetchMaintenances();
        await fetchFrequencies();
      }
    };

    const timeoutId = setTimeout(executeFetch, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchMaintenances, fetchFrequencies]);

  return {
    maintenances,
    totalCount,
    isLoading,
    maintenance,
    isFetching,
    frequencies,
    isLoadingFrequencies,
    getMaintenanceById,
    getMaintenanceCalendar,
    createMaintenance,
    updateMaintenance,
    renewMaintenance,
    deleteMaintenance,
    downloadExcel,
    refreshFrequencies: fetchFrequencies,
    refresh: fetchMaintenances,
  };
};