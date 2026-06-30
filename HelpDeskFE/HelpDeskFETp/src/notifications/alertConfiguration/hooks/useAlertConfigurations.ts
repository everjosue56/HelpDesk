import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../api/axios-instance";
import { getAlertConfiguration } from "../../../api/generated/alert-configuration/alert-configuration"; 
import type { CreateAlertConfigurationDto, UpdateAlertConfigurationDto } from "../../../api/model";

export interface AlertConfigItem {
  id: number;
  title: string;
  subject: string;
  description: string;
  isGlobal: boolean;
  isActive: boolean;
  scheduledDate: string;
  createdDate: string;
  idArea: number | null;
  areaName: string;
  idAgency: number | null;
  agencyName: string;
}

export const useAlertConfigurations = (
  searchTerm: string,
  isActiveFilter: boolean | undefined,
  page: number,
  pageSize: number = 5,
) => {
  const { isAuthenticated } = useAuth();
  const [configurations, setConfigurations] = useState<AlertConfigItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [configDetail, setConfigDetail] = useState<AlertConfigItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Invocación exacta de Orval
  const configService = useMemo(() => getAlertConfiguration(AXIOS_INSTANCE), []);

  // 1. Listado Paginado y Filtrado
  const fetchConfigurations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const response = await configService.getApiAlertConfigurations({
        SearchTerm: searchTerm || undefined,
        IsActive: isActiveFilter,
        PageNumber: page,
        PageSize: pageSize,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || backendResponse?.Data || backendResponse || [];
      const serverTotalItems = backendResponse?.totalItems || backendResponse?.TotalItems || rawData.length;

      const formattedData: AlertConfigItem[] = Array.isArray(rawData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? rawData.map((item: any) => ({
            id: item.id || 0,
            title: item.title || "Sin Título",
            subject: item.subject || "Sin Asunto",
            description: item.description || "N/A",
            isGlobal: item.isGlobal ?? false,
            isActive: item.isActive ?? true,
            scheduledDate: item.scheduledDate || "N/A",
            createdDate: item.createdDate || "N/A",
            idArea: item.idArea || null,
            areaName: item.areaName || "N/A",
            idAgency: item.idAgency || null,
            agencyName: item.agencyName || "Global / No Aplica",
          }))
        : [];

      setConfigurations(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al recuperar configuraciones de alerta:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, searchTerm, isActiveFilter, page, pageSize, configService]);

  // 2. Detalle por ID
  const getConfigById = useCallback(async (id: number): Promise<AlertConfigItem | null> => {
    try {
      setIsFetching(true);
      const response = await configService.getApiAlertConfigurationsId(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const item = backendResponse?.data || backendResponse;

      if (!item) {
        setConfigDetail(null);
        return null;
      }

      const formatted: AlertConfigItem = {
        id: item.id || 0,
        title: item.title || "",
        subject: item.subject || "",
        description: item.description || "",
        isGlobal: item.isGlobal ?? false,
        isActive: item.isActive ?? true,
        scheduledDate: item.scheduledDate || "",
        createdDate: item.createdDate || "",
        idArea: item.idArea || null,
        areaName: item.areaName || "",
        idAgency: item.idAgency || null,
        agencyName: item.agencyName || "",
      };

      setConfigDetail(formatted);
      return formatted;
    } catch (error) {
      console.error(`Error al recuperar detalle ${id}:`, error);
      setConfigDetail(null);
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [configService]);

  // 3. Switch de Estado en Fila
  const toggleConfigStatus = async (id: number, currentItem: AlertConfigItem) => {
    const nuevoEstado = !currentItem.isActive;
    
    setConfigurations(prev =>
      prev.map(c => c.id === id ? { ...c, isActive: nuevoEstado } : c)
    );

    try {
      const updateDto: UpdateAlertConfigurationDto = {
        title: currentItem.title,
        subject: currentItem.subject,
        description: currentItem.description,
        isGlobal: currentItem.isGlobal,
        idArea: currentItem.idArea || 0,
        idAgency: currentItem.idAgency || 0,
        scheduledDate: currentItem.scheduledDate,
        isActive: nuevoEstado
      };
      await configService.putApiAlertConfigurationsId(id, updateDto);
    } catch (error) {
      console.error("Error al mutar el estado en backend:", error);
      setConfigurations(prev =>
        prev.map(c => c.id === id ? { ...c, isActive: currentItem.isActive } : c)
      );
    }
  };

  // 4. Mutaciones CRUD directas
  const createConfig = async (dto: CreateAlertConfigurationDto) => {
    try {
      setIsLoading(true);
      await configService.postApiAlertConfigurations(dto);
      await fetchConfigurations();
    } catch (error) {
      console.error("Error al crear la configuración:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async (id: number, dto: UpdateAlertConfigurationDto) => {
    try {
      setIsLoading(true);
      await configService.putApiAlertConfigurationsId(id, dto);
      await fetchConfigurations();
    } catch (error) {
      console.error("Error al actualizar la configuración:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConfig = async (id: number) => {
    try {
      setIsLoading(true);
      await configService.deleteApiAlertConfigurationsId(id);
      await fetchConfigurations();
    } catch (error) {
      console.error("Error al eliminar la configuración:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      if (isMounted) await fetchConfigurations();
    };
    const timeoutId = setTimeout(executeFetch, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchConfigurations]);

  return {
    configurations,
    totalCount,
    isLoading,
    configDetail,
    isFetching,
    getConfigById,
    toggleConfigStatus,
    createConfig,
    updateConfig,
    deleteConfig,
    refresh: fetchConfigurations,
  };
};