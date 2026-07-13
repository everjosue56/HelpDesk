import { useState, useEffect, useCallback, useMemo } from "react";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getResolution } from "../../../../api/generated/resolution/resolution";
import type {
  GetApiResolutionsParams,
  CreateResolutionDto,
  UpdateResolutionDto,
  ResolutionDto,
} from "../../../../api/model";

export const useResolutions = (
  keyword: string,
  page: number,
  pageSize: number = 5,
  filters?: {
    idTicket?: number | null;
    idUser?: number | null;
    idSolutionStatus?: number | null;
    idDevice?: number | null;
    idPriority?: number | null;
    dateFrom?: string | null;
    dateTo?: string | null;
  },
) => {
  const [resolutions, setResolutions] = useState<ResolutionDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [resolvedTodayCount, setTotalresolvedTodayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const service = useMemo(() => getResolution(AXIOS_INSTANCE), []);

  const filterTicket = filters?.idTicket;
  const filterUser = filters?.idUser;
  const filterStatus = filters?.idSolutionStatus;
  const filterDevice = filters?.idDevice;
  const filterPriority = filters?.idPriority;
  const filterDateFrom = filters?.dateFrom;
  const filterDateTo = filters?.dateTo;

  // ─── CONSULTA PAGINADA Y FILTRADA ───
  const fetchResolutions = useCallback(async (isMounted: boolean = true) => {
    if (isMounted) setIsLoading(true);
    try {
      const params: GetApiResolutionsParams = {
        Keyword: keyword || undefined,
        PageNumber: page,
        PageSize: pageSize,
        IdTicket: filterTicket || undefined,
        IdUser: filterUser || undefined,
        IdSolutionStatus: filterStatus || undefined,
        IdDevice: filterDevice || undefined,
        IdPriority: filterPriority || undefined,
        DateFrom: filterDateFrom || undefined,
        DateTo: filterDateTo || undefined,
      };

      const response = await service.getApiResolutions(params);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;

      if (isMounted) {
        setResolutions(
          backendResponse?.data || backendResponse?.Data || backendResponse || [],
        );
        setTotalCount(
          backendResponse?.totalItems ||
            backendResponse?.TotalItems ||
            backendResponse?.length ||
            0,
        );
        setTotalresolvedTodayCount(backendResponse?.resolvedTodayCount || 0);
      }
    } catch (error) {
      console.error("Error al consultar las resoluciones de soporte:", error);
      if (isMounted) {
        setResolutions([]);
        setTotalresolvedTodayCount(0);
        setTotalCount(0);
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }

  }, [keyword, page, pageSize, filterTicket, filterUser, filterStatus, filterDevice, filterPriority, filterDateFrom, filterDateTo, service]);

  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      await fetchResolutions(isMounted);
    };
    executeFetch();
    return () => {
      isMounted = false;
    };
  }, [fetchResolutions]);

  // ─── OPERACIONES DE MUTACIÓN (CRUD) ───

  const createResolution = async (data: CreateResolutionDto) => {
    setIsLoading(true);
    try {
      await service.postApiResolutions(data);
      await fetchResolutions(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateResolution = async (id: number, data: UpdateResolutionDto) => {
    setIsLoading(true);
    try {
      await service.putApiResolutionsId(id, data);
      await fetchResolutions(true);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteResolution = async (id: number) => {
    setIsLoading(true);
    try {
      await service.deleteApiResolutionsId(id);
      await fetchResolutions(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getResolutionById = useCallback(
    async (id: number) => {
      const response = await service.getApiResolutionsId(id);
      return response.data;
    },
    [service],
  );

  return {
    resolutions,
    totalCount,
    isLoading,
    resolvedTodayCount,
    refresh: () => fetchResolutions(true),
    createResolution,
    updateResolution,
    deleteResolution,
    getResolutionById,
  };
};