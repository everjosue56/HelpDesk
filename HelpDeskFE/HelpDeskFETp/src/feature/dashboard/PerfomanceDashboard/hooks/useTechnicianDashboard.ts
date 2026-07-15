import { useState, useEffect, useCallback, useMemo } from 'react';
import { AXIOS_INSTANCE } from '../../../../api/axios-instance';
import { getDashboard } from '../../../../api/generated/dashboard/dashboard';

export interface TechnicianPerformanceData {
    tecnicoNombre: string;
    ticketsResueltos: number;
    mttrHoras: number;
}

export const useTechnicianDashboard = (initialYear: number = 2026) => {
    const [year, setYear] = useState<number>(initialYear);
    const [month, setMonth] = useState<number | undefined>(new Date().getMonth() + 1);
    const [selectedUser, setSelectedUser] = useState<number | undefined>(undefined);
    const [techRecords, setTechRecords] = useState<TechnicianPerformanceData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const service = useMemo(() => getDashboard(AXIOS_INSTANCE), []);

    const fetchTechData = useCallback(async (targetYear: number, targetMonth: number | undefined, userId: number | undefined, isMounted: boolean) => {
        try {
            if (isMounted) setIsLoading(true);

            const response = await service.getApiDashboardRendimientoTecnicos({
                year: targetYear,
                month: targetMonth || undefined,
                userId: userId || undefined
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const backendResponse = response.data as any;

            if (isMounted) {
                const data = backendResponse?.data || backendResponse?.Data || backendResponse || [];
                setTechRecords(data);
            }
        } catch (error) {
            console.error("Error al recuperar el rendimiento técnico:", error);
            if (isMounted) setTechRecords([]);
        } finally {
            if (isMounted) setIsLoading(false);
        }
    }, [service]);

    useEffect(() => {
        let isMounted = true;
        const executeFetch = async () => {
            await fetchTechData(year, month, selectedUser, isMounted);
        };
        executeFetch();
        return () => { isMounted = false; };
    }, [year, month, selectedUser, fetchTechData]);

     const kpis = useMemo(() => {
   
    const totalResueltos = techRecords.reduce((acc, curr) => acc + (curr.ticketsResueltos || 0), 0);
    
    const promedioMttr = techRecords.length > 0 
        ? Math.round((techRecords.reduce((acc, curr) => acc + (curr.mttrHoras || 0), 0) / techRecords.length) * 100) / 100
        : 0;
        
    return { totalResueltos, promedioMttr };
}, [techRecords]);

    return {
        year,
        setYear,
        month,
        setMonth,
        selectedUser,
        setSelectedUser,
        techRecords,
        kpis,
        isLoading,
        refresh: () => fetchTechData(year, month, selectedUser, true)
    };
};