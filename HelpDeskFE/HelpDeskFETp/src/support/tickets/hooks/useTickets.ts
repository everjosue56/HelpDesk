import { useState, useEffect, useCallback, useMemo } from "react";
import { AXIOS_INSTANCE } from "../../../api/axios-instance";
import { getTicket } from "../../../api/generated/ticket/ticket";
import type {
  GetApiTicketsParams,
  CreateTicketDto,
  UpdateTicketDto,
} from "../../../api/model";

export interface TicketItem {
  id: number;
  reportDate: string;
  description: string;
  isActive: boolean;
  idUser: number;
  userName: string;
  idTypeError: number;
  typeErrorName: string;
  idArea: number;
  areaName: string;
  idSoftwareSystem: number;
  softwareSystemName: string;
  idImpact: number;
  impactName: string;
  idPriority: number;
  priorityName: string;
}

export const useTickets = (
  keyword: string,
  page: number,
  pageSize: number = 10,
  filters?: {
    idTypeError?: number | null;
    idArea?: number | null;
    idSoftwareSystem?: number | null;
    idImpact?: number | null;
    idPriority?: number | null;
    idUser?: number | null;
    dateFrom?: string | null;
    dateTo?: string | null;
  },
) => {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTicketsCount, setTotalActiveTicketsCount] = useState(0);
  const [resolvedTodayCount, setTotalresolvedTodayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const service = useMemo(() => getTicket(AXIOS_INSTANCE), []);

  const filterTypeError = filters?.idTypeError;
  const filterArea = filters?.idArea;
  const filterSoftware = filters?.idSoftwareSystem;
  const filterImpact = filters?.idImpact;
  const filterPriority = filters?.idPriority;
  const filterUser = filters?.idUser;
  const filterDateFrom = filters?.dateFrom;
  const filterDateTo = filters?.dateTo;

  // ─── CONSULTA PAGINADA Y FILTRADA ───
  const fetchTickets = useCallback(async (isMounted: boolean = true) => {
    if (isMounted) setIsLoading(true);
    try {
      const params: GetApiTicketsParams = {
        Keyword: keyword || undefined,
        PageNumber: page,
        PageSize: pageSize,
        IdTypeError: filterTypeError || undefined,
        IdArea: filterArea || undefined,
        IdSoftwareSystem: filterSoftware || undefined,
        IdImpact: filterImpact || undefined,
        IdPriority: filterPriority || undefined,
        IdUser: filterUser || undefined,
        DateFrom: filterDateFrom || undefined,
        DateTo: filterDateTo || undefined,
      };

      const response = await service.getApiTickets(params);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;

      if (isMounted) {
        setTickets(backendResponse?.data || backendResponse?.Data || backendResponse || []);
        setTotalCount(
          backendResponse?.totalItems || 
            backendResponse?.TotalItems || 
            backendResponse?.length || 
            0,    
        );
        setTotalActiveTicketsCount(backendResponse?.activeTicketsCount || backendResponse?.ActiveTicketsCount || 0);
        setTotalresolvedTodayCount(backendResponse?.resolvedTodayCount || backendResponse?.ResolvedTodayCount || 0);
      }
    } catch (error) {
      console.error("Error al consultar tickets:", error);
      if (isMounted) {
        setTickets([]);
        setTotalCount(0);
        setTotalActiveTicketsCount(0);
        setTotalresolvedTodayCount(0);
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }

  }, [keyword, page, pageSize, filterTypeError, filterArea, filterSoftware, filterImpact, filterPriority, filterUser, filterDateFrom, filterDateTo, service]);
      
  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      await fetchTickets(isMounted);
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchTickets]);

  // ─── OPERACIONES DE MUTACIÓN (CRUD) ───

  const createTicket = async (data: CreateTicketDto) => {
    setIsLoading(true);
    try {
      await service.postApiTickets(data);
      await fetchTickets(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicket = async (id: number, data: UpdateTicketDto) => {
    setIsLoading(true);
    try {
      await service.putApiTicketsId(id, data);
      await fetchTickets(true);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTicket = async (id: number) => {
    setIsLoading(true);
    try {
      await service.deleteApiTicketsId(id);
      await fetchTickets(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketById = useCallback(
    async (id: number) => {
      const response = await service.getApiTicketsId(id);
      return response.data;
    },
    [service],
  );

  return {
    tickets,
    totalCount,
    activeTicketsCount,
    resolvedTodayCount,
    isLoading,
    refresh: () => fetchTickets(true),
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
  };
};