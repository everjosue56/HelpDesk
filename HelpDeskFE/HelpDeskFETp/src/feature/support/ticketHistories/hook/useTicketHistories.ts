import { useState, useEffect, useCallback, useMemo } from "react";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getTicketHistory } from "../../../../api/generated/ticket-history/ticket-history"; 
import type { GetApiTicketHistoriesParams } from "../../../../api/model";

export interface TicketHistoryDto {
    id: number;
    closeDate: string;
    createdDate: string;
    idTicket: number;
    ticketDescription: string;
    softwareSystemName: string;
    idResolution: number;
    actionTaken: string;
    rootCause: string;
    solutionTime: number;
    idUser: number;
    userName: string;
}

export const useTicketHistories = (
    page: number,
    pageSize: number = 5,
    filters?: {
        idTicket?: number | null;
        idResolution?: number | null;
        idUser?: number | null;
        dateFrom?: string | null;
        dateTo?: string | null;
    }
) => {
    const [histories, setHistories] = useState<TicketHistoryDto[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const service = useMemo(() => getTicketHistory(AXIOS_INSTANCE), []);

    const filterTicket = filters?.idTicket;
    const filterResolution = filters?.idResolution;
    const filterUser = filters?.idUser;
    const filterDateFrom = filters?.dateFrom;
    const filterDateTo = filters?.dateTo;

    const fetchHistories = useCallback(async (isMounted: boolean = true) => {
        if (isMounted) setIsLoading(true);
        try {
            const params: GetApiTicketHistoriesParams = {
                PageNumber: page,
                PageSize: pageSize,
                IdTicket: filterTicket || undefined,
                IdResolution: filterResolution || undefined,
                IdUser: filterUser || undefined,
                DateFrom: filterDateFrom || undefined,
                DateTo: filterDateTo || undefined,
            };

            const response = await service.getApiTicketHistories(params);
            
            const backendResponse = response.data as unknown as {
                data?: TicketHistoryDto[];
                Data?: TicketHistoryDto[];
                totalItems?: number;
                TotalItems?: number;
            };
            
            if (isMounted) {
                const resData = backendResponse?.data || backendResponse?.Data || (backendResponse as unknown as TicketHistoryDto[]) || [];
                setHistories(resData);
                setTotalCount(backendResponse?.totalItems || backendResponse?.TotalItems || resData.length || 0);
            }
        } catch (error) {
            console.error("Error al consultar el historial de tickets:", error);
            if (isMounted) {
                setHistories([]);
                setTotalCount(0);
            }
        } finally {
            if (isMounted) setIsLoading(false);
        }
    }, [page, pageSize, filterTicket, filterResolution, filterUser, filterDateFrom, filterDateTo, service]);

    useEffect(() => {
        let isMounted = true;
        
        const executeFetch = async () => {
            await fetchHistories(isMounted);
        };

        executeFetch();
        
        return () => { 
            isMounted = false; 
        };
    }, [fetchHistories]);

    return {
        histories,
        totalCount,
        isLoading,
        refreshHistories: () => fetchHistories(true)
    };
};