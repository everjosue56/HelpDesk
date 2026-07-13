import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getAgency } from "../../../../api/generated/agency/agency";
import type { CreateAgencyDto, UpdateAgencyDto } from "../../../../api/model";

export interface AgencyItem {
  id: number;
  name: string;
  contact?: string;
  address?: string;
  email?: string;
  organizationName: string;
  organizationId: number;
  isActive: boolean;
  createdDate?: string;
}

export const useAgencies = (
  searchTerm: string,
  organizationSearch: string,
  page: number,
  pageSize: number = 5,
) => {
  const { isAuthenticated } = useAuth();
  const [agencies, setAgencies] = useState<AgencyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [agency, setAgency] = useState<AgencyItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const agencyService = useMemo(() => getAgency(AXIOS_INSTANCE), []);

  const fetchAgencies = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      // Llamada tipada a la API generada por Orval
      const response = await agencyService.getApiAgencies({
        PageNumber: page,
        PageSize: pageSize,
        SearchOrganizationName: organizationSearch,
        Name: searchTerm || undefined,
      });

      // Mapeo seguro de la respuesta estructurada
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || [];
      const serverTotalItems = backendResponse?.totalItems || 0;

      const formattedData: AgencyItem[] = Array.isArray(rawData)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawData.map((item: any) => ({
            id: item.id || 0,
            name: item.name || "Sin Nombre",
            contact: item.phoneNumber || "N/A",
            address: item.address || "N/A",
            email: item.email || "N/A",
            organizationName:
              item.organizationName || item.organization?.name || "N/A",
            organizationId: item.idOrganization || item.organizationId || 0,
            isActive: item.isActive ?? true,
            createdDate: item.createdDate || "N/A",
          }))
        : [];

      setAgencies(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al cargar agencias mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    searchTerm,
    page,
    pageSize,
    agencyService,
    organizationSearch,
  ]);

  // 2. Obtener registro individual por ID
  const getAgencyById = useCallback(
    async (id: number): Promise<AgencyItem | null> => {
      try {
        setIsFetching(true);
        const response = await agencyService.getApiAgenciesId(id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendResponse = response.data as any;
        const item = backendResponse?.data || backendResponse;

        if (!item) {
          setAgency(null);
          return null;
        }

        const formatted: AgencyItem = {
          id: item.id || 0,
          name: item.name || "",
          contact: item.phoneNumber || "",
          address: item.address || "",
          email: item.email || "",
          organizationId: item.idOrganization || 0,
          organizationName: item.organizationName || "",
          isActive: item.isActive ?? true,
          createdDate: item.createdDate,
        };

        setAgency(formatted);
        return formatted;
      } catch (error) {
        console.error(`Error al obtener detalle de agencia ${id}:`, error);
        setAgency(null);
        return null;
      } finally {
        setIsFetching(false);
      }
    },
    [agencyService],
  );

  // 3. Mutaciones CRUD (POST, PUT, DELETE)
  const createAgency = async (dto: CreateAgencyDto) => {
    try {
      setIsLoading(true);
      await agencyService.postApiAgencies(dto);
      await fetchAgencies();
    } catch (error) {
      console.error("Error al crear la agencia:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAgency = async (id: number, dto: UpdateAgencyDto) => {
    try {
      setIsLoading(true);
      await agencyService.putApiAgenciesId(id, dto);
      await fetchAgencies();
    } catch (error) {
      console.error("Error al actualizar la agencia:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAgency = async (id: number) => {
    try {
      setIsLoading(true);
      await agencyService.deleteApiAgenciesId(id);
      await fetchAgencies();
    } catch (error) {
      console.error("Error al eliminar la agencia:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchAgencies();
      }
    };

    const timeoutId = setTimeout(executeFetch, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchAgencies]);

  return {
    agencies,
    totalCount,
    isLoading,
    agency,
    isFetching,
    getAgencyById,
    createAgency,
    updateAgency,
    deleteAgency,
    refresh: fetchAgencies,
  };
};
