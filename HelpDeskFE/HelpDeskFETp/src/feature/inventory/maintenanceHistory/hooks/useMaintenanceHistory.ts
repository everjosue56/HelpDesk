import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getMaintenanceHistory } from "../../../../api/generated/maintenance-history/maintenance-history";

export interface MaintenanceHistoryItem {
  id: number;
  solutionTime: number;
  createdDate: string;
  idMaintenance: number;
  maintenanceDetails: string;
  idDevice: number;
  deviceCode: string;
  deviceBrand: string;
  deviceType: string;
  typeMaintenanceName: string;
  idUser: number;
  technicalName: string;
  technicalEmail: string;
}

export const useMaintenanceHistory = (
  idMaintenance: number | null,
  idDevice: number | null,
  idUser: number | null,
  idTypeDevice: number | null,
  page: number,
  pageSize: number = 5,
) => {
  const { isAuthenticated } = useAuth();
  const [histories, setHistories] = useState<MaintenanceHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [history, setHistory] = useState<MaintenanceHistoryItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // 1. Servicio generado por Orval
  const historyService = useMemo(
    () => getMaintenanceHistory(AXIOS_INSTANCE),
    [],
  );

  // 2. Obtener listado mediante useCallback con tu patrón de mapeo exacto
  const fetchMaintenanceHistories = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const response = await historyService.getApiMaintenanceHistories({
        PageNumber: page,
        PageSize: pageSize,
        IdMaintenance: idMaintenance || undefined,
        IdDevice: idDevice || undefined,
        IdUser: idUser || undefined,
        IdTypeDevice: idTypeDevice || undefined,
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // Mapeo exacto basado en la respuesta
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || [];
      const serverTotalItems = backendResponse?.totalItems || 0;

      const formattedData: MaintenanceHistoryItem[] = Array.isArray(rawData)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawData.map((item: any) => ({
            id: item.id || 0,
            solutionTime: item.solutionTime || 0,
            createdDate: item.createdDate || "N/A",
            idMaintenance: item.idMaintenance || 0,
            maintenanceDetails: item.maintenanceDetails || "Sin Detalles",
            idDevice: item.idDevice || 0,
            deviceCode: item.deviceCode || "N/A",
            deviceBrand: item.deviceBrand || "N/A",
            deviceType: item.deviceType || "N/A",
            typeMaintenanceName: item.typeMaintenanceName || "N/A",
            idUser: item.idUser || 0,
            technicalName: item.technicalName || "Sin Asignar",
            technicalEmail: item.technicalEmail || "N/A",
          }))
        : [];

      setHistories(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error(
        "Error al cargar historial de mantenimientos paginados mediante Orval:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    idMaintenance,
    idDevice,
    idUser,
    idTypeDevice,
    page,
    pageSize,
    historyService,
  ]);

  // 3. Obtener un registro individual por ID con Mapeo para tu DetailsPage
  const getMaintenanceHistoryById = useCallback(
    async (id: number): Promise<MaintenanceHistoryItem | null> => {
      try {
        setIsFetching(true);
        const response = await historyService.getApiMaintenanceHistoriesId(id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendResponse = response.data as any;
        const item = backendResponse?.data || backendResponse;

        if (!item) {
          setHistory(null);
          return null;
        }

        const formatted: MaintenanceHistoryItem = {
          id: item.id || 0,
          solutionTime: item.solutionTime || 0,
          createdDate: item.createdDate || "N/A",
          idMaintenance: item.idMaintenance || 0,
          maintenanceDetails: item.maintenanceDetails || "",
          idDevice: item.idDevice || 0,
          deviceCode: item.deviceCode || "",
          deviceBrand: item.deviceBrand || "",
          deviceType: item.deviceType || "",
          typeMaintenanceName: item.typeMaintenanceName || "",
          idUser: item.idUser || 0,
          technicalName: item.technicalName || "",
          technicalEmail: item.technicalEmail || "",
        };

        setHistory(formatted);
        return formatted;
      } catch (error) {
        console.error(
          `Error al obtener detalle del historial de mantenimiento ${id}:`,
          error,
        );
        setHistory(null);
        return null;
      } finally {
        setIsFetching(false);
      }
    },
    [historyService],
  );

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchMaintenanceHistories();
      }
    };

    const timeoutId = setTimeout(executeFetch, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchMaintenanceHistories]);

  return {
    histories,
    totalCount,
    isLoading,
    history,
    isFetching,
    getMaintenanceHistoryById,
    refresh: fetchMaintenanceHistories,
  };
};
