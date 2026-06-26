import { useState, useEffect, useCallback, useMemo } from 'react';
import { AXIOS_INSTANCE } from '../../../api/axios-instance';
import { getDashboard } from '../../../api/generated/dashboard/dashboard';

export interface AgencyKpiData {
    agenciaNombre: string;
    totalTickets: number;
    ticketsCriticos: number;
}

export const useAgenciesDashboard = (initialYear: number = 2026) => {
    const [year, setYear] = useState<number>(initialYear);
    const [month, setMonth] = useState<number | undefined>(new Date().getMonth() + 1); 
    const [agenciesRecords, setAgenciesRecords] = useState<AgencyKpiData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const service = useMemo(() => getDashboard(AXIOS_INSTANCE), []);

    const fetchAgenciesData = useCallback(async (targetYear: number, targetMonth: number | undefined, isMounted: boolean) => {
        try {
            if (isMounted) setIsLoading(true);
            
            const response = await service.getApiDashboardCargaAgencias({ 
                year: targetYear, 
                month: targetMonth || undefined 
            });
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const backendResponse = response.data as any;

            if (isMounted) {
                const data = backendResponse?.data || backendResponse?.Data || backendResponse || [];
                setAgenciesRecords(data);
            }
        } catch (error) {
            console.error("Error al recuperar las métricas de agencias:", error);
            if (isMounted) setAgenciesRecords([]);
        } finally {
            if (isMounted) setIsLoading(false);
        }
    }, [service]);

    useEffect(() => {
        let isMounted = true;
        
        const executeFetch = async () => {
            await fetchAgenciesData(year, month, isMounted);
        };
        
        executeFetch();
        return () => { isMounted = false; };
    }, [year, month, fetchAgenciesData]);

    // KPIs dinámicos calculados basándose en el registro activo devuelto
    const kpis = useMemo(() => {
        const totalTickets = agenciesRecords.reduce((acc, curr) => acc + (curr.totalTickets || 0), 0);
        const totalAgencias = agenciesRecords.length;
        return { totalTickets, totalAgencias };
    }, [agenciesRecords]);

    return {
        year,
        setYear,
        month,
        setMonth, 
        agenciesRecords,
        kpis,
        isLoading,
        refresh: () => fetchAgenciesData(year, month, true)
    };
};