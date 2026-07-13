import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import type { CreateTypeMaintenanceDto, UpdateTypeMaintenanceDto } from "../../../../api/model"; 
import { getTypeMaintenance } from "@/api/generated/type-maintenance/type-maintenance";

export interface TypeMaintenanceItem {
  id: number;
  name: string;
  estimatedTime: number;
  createdDate?: string;
}

export const useTypeMaintenance = (
  searchTerm: string,
  page: number,
  pageSize: number = 5,
) => {
  const { isAuthenticated } = useAuth();
  const [typeMaintenance, setTypeMaintenance] = useState<TypeMaintenanceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [maintenance, setMaintenance] = useState<TypeMaintenanceItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // 1. Servicio generado por Orval 
  const maintenanceService = useMemo(() => getTypeMaintenance(AXIOS_INSTANCE), []);

  // 2. Obtener listado mediante useCallback
 const fetchTypeMaintenances = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const response = await maintenanceService.getApiTypeMaintenances({
        PageNumber: page,
        PageSize: pageSize,
        Name: searchTerm || undefined, 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || [];
      const serverTotalItems = backendResponse?.totalItems || 0;

      const formattedData: TypeMaintenanceItem[] = Array.isArray(rawData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? rawData.map((item: any) => ({
            id: item.id || 0,
            name: item.name || "Sin Nombre",
            estimatedTime: item.estimatedTime || 0, 
            createdDate: item.createdDate || "N/A",
          }))
        : [];

      setTypeMaintenance(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al cargar tipos de mantenimiento paginados mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, searchTerm, page, pageSize, maintenanceService]);
  // 3. Obtener un registro individual por ID con Mapeo 
  const getTypeMaintenanceById = useCallback(
    async (id: number): Promise<TypeMaintenanceItem | null> => {
      try {
        setIsFetching(true);
        const response = await maintenanceService.getApiTypeMaintenancesId(id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendResponse = response.data as any;
        const item = backendResponse?.data || backendResponse;

        if (!item) {
          setMaintenance(null);
          return null;
        }

        const formatted: TypeMaintenanceItem = {
          id: item.id || 0,
          name: item.name || "",
          estimatedTime: item.estimatedTime || "",
          createdDate: item.createdDate,
        };

        setMaintenance(formatted);
        return formatted;
      } catch (error) {
        console.error(`Error al obtener detalle de tipo de mantenimiento ${id}:`, error);
        setMaintenance(null);
        return null;
      } finally {
        setIsFetching(false);
      }
    },
    [maintenanceService],
  );

  // 4. Mutaciones CRUD (POST, PUT, DELETE) 
  const createTypeMaintenance = async (dto: CreateTypeMaintenanceDto) => {
    try {
      setIsLoading(true);
      await maintenanceService.postApiTypeMaintenances(dto);
      await fetchTypeMaintenances(); 
    } catch (error) {
      console.error("Error al crear el tipo de mantenimiento:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTypeMaintenance = async (id: number, dto: UpdateTypeMaintenanceDto) => {
    try {
      setIsLoading(true);
      await maintenanceService.putApiTypeMaintenancesId(id, dto);
      await fetchTypeMaintenances(); 
    } catch (error) {
      console.error("Error al actualizar el tipo de mantenimiento:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTypeMaintenance = async (id: number) => {
    try {
      setIsLoading(true);
      await maintenanceService.deleteApiTypeMaintenancesId(id);
      await fetchTypeMaintenances();
    } catch (error) {
      console.error("Error al eliminar el tipo de mantenimiento:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchTypeMaintenances();
      }
    };

    const timeoutId = setTimeout(executeFetch, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchTypeMaintenances]);

  return {
    typeMaintenance,
    totalCount,
    isLoading,
    maintenance,
    isFetching,
    getTypeMaintenanceById,
    createTypeMaintenance,
    updateTypeMaintenance,
    deleteTypeMaintenance, 
    refresh: fetchTypeMaintenances,
  };
};