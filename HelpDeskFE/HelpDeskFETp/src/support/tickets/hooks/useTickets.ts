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

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: GetApiTicketsParams = {
        Keyword: keyword || undefined,
        PageNumber: page,
        PageSize: pageSize,
        IdTypeError: filters?.idTypeError || undefined,
        IdArea: filters?.idArea || undefined,
        IdSoftwareSystem: filters?.idSoftwareSystem || undefined,
        IdImpact: filters?.idImpact || undefined,
        IdPriority: filters?.idPriority || undefined,
        IdUser: filters?.idUser || undefined,
        DateFrom: filters?.dateFrom || undefined,
        DateTo: filters?.dateTo || undefined,
      };

      const response = await service.getApiTickets(params);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;

      setTickets(backendResponse?.data || backendResponse || []);
      setTotalCount(
        backendResponse?.totalItems || backendResponse?.length || 0,    
      );
      setTotalActiveTicketsCount(backendResponse?.activeTicketsCount || 0);
      setTotalresolvedTodayCount(backendResponse?.resolvedTodayCount || 0);
    } catch (error) {
      console.error("Error al consultar tickets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, page, pageSize, filters, service]);
      

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchTickets();
      }
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchTickets]);

  const createTicket = async (data: CreateTicketDto) => {
    setIsLoading(true);
    try {
      await service.postApiTickets(data);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicket = async (id: number, data: UpdateTicketDto) => {
    setIsLoading(true);
    try {
      await service.putApiTicketsId(id, data);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTicket = async (id: number) => {
    setIsLoading(true);
    try {
      await service.deleteApiTicketsId(id);
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
    refresh: fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
  };
};
