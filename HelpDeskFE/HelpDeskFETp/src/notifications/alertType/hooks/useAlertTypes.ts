import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../api/axios-instance";
import { getAlertType } from "../../../api/generated/alert-type/alert-type"; 
import type { CreateAlertTypeDto, UpdateAlertTypeDto } from "../../../api/model";

export interface AlertTypeItem {
  id: number;
  name: string;
}

export const useAlertTypes = (
  searchTerm: string,
  page: number,
  pageSize: number = 5,
) => {
  const { isAuthenticated } = useAuth();
  const [alertTypes, setAlertTypes] = useState<AlertTypeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [alertTypeDetail, setAlertTypeDetail] = useState<AlertTypeItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const typeService = useMemo(() => getAlertType(AXIOS_INSTANCE), []);

  // 1. Listado Paginado y Filtrado
  const fetchAlertTypes = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const response = await typeService.getApiAlertTypes({
        PageNumber: page,
        PageSize: pageSize,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({ SearchTerm: searchTerm || undefined } as any),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({ Keyword: searchTerm || undefined } as any),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || backendResponse?.Data || backendResponse || [];
      const serverTotalItems = backendResponse?.totalItems || backendResponse?.TotalItems || rawData.length;

      const formattedData: AlertTypeItem[] = Array.isArray(rawData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? rawData.map((item: any) => ({
            id: item.id || 0,
            name: item.name || "Sin Nombre",
          }))
        : [];

      setAlertTypes(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al cargar los tipos de alertas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, searchTerm, page, pageSize, typeService]);

  // 2. Obtener por ID
  const getAlertTypeById = useCallback(async (id: number): Promise<AlertTypeItem | null> => {
    try {
      setIsFetching(true);
      const response = await typeService.getApiAlertTypesId(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const item = backendResponse?.data || backendResponse;

      if (!item) {
        setAlertTypeDetail(null);
        return null;
      }

      const formatted: AlertTypeItem = {
        id: item.id || 0,
        name: item.name || "",
      };

      setAlertTypeDetail(formatted);
      return formatted;
    } catch (error) {
      console.error(`Error al recuperar tipo de alerta ${id}:`, error);
      setAlertTypeDetail(null);
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [typeService]);

  // 3. Mutaciones CRUD
  const createAlertType = async (dto: CreateAlertTypeDto) => {
    try {
      setIsLoading(true);
      await typeService.postApiAlertTypes(dto);
      await fetchAlertTypes();
    } catch (error) {
      console.error("Error al crear el tipo de alerta:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAlertType = async (id: number, dto: UpdateAlertTypeDto) => {
    try {
      setIsLoading(true);
      await typeService.putApiAlertTypesId(id, dto);
      await fetchAlertTypes();
    } catch (error) {
      console.error("Error al actualizar el tipo de alerta:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAlertType = async (id: number) => {
    try {
      setIsLoading(true);
      await typeService.deleteApiAlertTypesId(id);
      await fetchAlertTypes();
    } catch (error) {
      console.error("Error al eliminar el tipo de alerta:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      if (isMounted) await fetchAlertTypes();
    };
    const timeoutId = setTimeout(executeFetch, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchAlertTypes]);

  return {
    alertTypes,
    totalCount,
    isLoading,
    alertTypeDetail,
    isFetching,
    getAlertTypeById,
    createAlertType,
    updateAlertType,
    deleteAlertType,
    refresh: fetchAlertTypes,
  };
};