import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../api/axios-instance";
import { getArea } from "../../../api/generated/area/area"; 
import type { CreateAreaDto, UpdateAreaDto } from "../../../api/model"; 

export interface AreaItem {
  id: number;
  nameArea: string;
  agencyName: string;
  idAgency: number; 
  isActive: boolean;
  createdDate?: string;
}

export const useAreas = (
  searchTerm: string,
  agencySearch: string, 
  page: number,
  pageSize: number = 5,
) => {
  const { isAuthenticated } = useAuth();
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [area, setArea] = useState<AreaItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Servicio generado por Orval
  const areaService = useMemo(() => getArea(AXIOS_INSTANCE), []);

  // 1. Obtener listado paginado y filtrado por nombre de área y agencia
  const fetchAreas = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      // Llamada tipada mediante la API de Orval
      const response = await areaService.getApiAreas({
        PageNumber: page,
        PageSize: pageSize,
        SearchName: searchTerm || undefined,
        SearchAgencyName: agencySearch || undefined, 
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || [];
      const serverTotalItems = backendResponse?.totalItems || 0;

      const formattedData: AreaItem[] = Array.isArray(rawData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? rawData.map((item: any) => ({
            id: item.id || 0,
            nameArea: item.nameArea || "Sin Nombre",
            agencyName: item.agencyName || item.agency?.name || "N/A",
            idAgency: item.idAgency || item.agencyId || 0,
            isActive: item.isActive ?? true,
            createdDate: item.createdDate || "N/A",
          }))
        : [];

      setAreas(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al cargar áreas mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, searchTerm, page, pageSize, areaService, agencySearch]); 

  // 2. Obtener un registro individual por ID 
  const getAreaById = useCallback(
    async (id: number): Promise<AreaItem | null> => {
      try {
        setIsFetching(true);
        const response = await areaService.getApiAreasId(id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendResponse = response.data as any;
        const item = backendResponse?.data || backendResponse;

        if (!item) {
          setArea(null);
          return null;
        }

        const formatted: AreaItem = {
          id: item.id || 0,
          nameArea: item.nameArea || "",
          idAgency: item.idAgency || 0,
          agencyName: item.agencyName || "",
          isActive: item.isActive ?? true,
          createdDate: item.createdDate,
        };

        setArea(formatted);
        return formatted;
      } catch (error) {
        console.error(`Error al obtener detalle de área ${id}:`, error);
        setArea(null);
        return null;
      } finally {
        setIsFetching(false);
      }
    },
    [areaService],
  );

  // 3. Mutaciones CRUD conectadas a Orval (POST, PUT, DELETE)
  const createArea = async (dto: CreateAreaDto) => {
    try {
      setIsLoading(true);
      await areaService.postApiAreas(dto);
      await fetchAreas(); 
    } catch (error) {
      console.error("Error al crear el área:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateArea = async (id: number, dto: UpdateAreaDto) => {
    try {
      setIsLoading(true);
      await areaService.putApiAreasId(id, dto);
      await fetchAreas(); 
    } catch (error) {
      console.error("Error al actualizar el área:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArea = async (id: number) => {
    try {
      setIsLoading(true);
      await areaService.deleteApiAreasId(id);
      await fetchAreas();
    } catch (error) {
      console.error("Error al eliminar el área:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchAreas();
      }
    };

    const timeoutId = setTimeout(executeFetch, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchAreas]);

  return {
    areas,
    totalCount,
    isLoading,
    area,
    isFetching,
    getAreaById,
    createArea,
    updateArea,
    deleteArea, 
    refresh: fetchAreas,
  };
};