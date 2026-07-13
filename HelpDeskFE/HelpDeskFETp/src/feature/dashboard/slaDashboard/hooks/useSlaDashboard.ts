import { useState, useEffect, useCallback, useMemo } from 'react';
import { AXIOS_INSTANCE } from '../../../../api/axios-instance';
import { getDashboard } from '../../../../api/generated/dashboard/dashboard'; 

export interface SlaMonthlyData {
    mesNumero: number;
    mesNombre: string;
    meta: number;
    metaAlcanzada: number;
    incidentesReportados: number;
    tiempoPromedioResolucion: number;
    cumplimiento: string;
}

export const useSlaDashboard = (initialYear: number = 2026) => {
    const [year, setYear] = useState<number>(initialYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(1); 
    const [monthlyRecords, setMonthlyRecords] = useState<SlaMonthlyData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const service = useMemo(() => getDashboard(AXIOS_INSTANCE), []);

    const fetchSlaData = useCallback(async (targetYear: number, isMounted: boolean) => {
        try {
            if (isMounted) setIsLoading(true);
            const response = await service.getApiDashboardSlaMensualYear(targetYear);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const backendResponse = response.data as any;

            if (isMounted) {
                // Mapeo flexible de Orval considerando variaciones
                const rawData = backendResponse?.data || backendResponse?.Data || backendResponse || [];
                setMonthlyRecords(rawData);
            }
        } catch (error) {
            console.error("Error al recuperar las métricas del SLA mensual:", error);
            if (isMounted) setMonthlyRecords([]);
        } finally {
            if (isMounted) setIsLoading(false);
        }
    }, [service]);

   useEffect(() => {
        let isMounted = true;
        const executeFetch = async () => {
            await fetchSlaData(year, isMounted);
        };

        executeFetch();
        
        return () => { 
            isMounted = false; 
        };
    }, [year, fetchSlaData]);
    // Extrae la data específica del mes seleccionado para las tarjetas superiores de KPI
    const activeKpiData = useMemo(() => {
        const defaultKpi: SlaMonthlyData = {
            mesNumero: selectedMonth,
            mesNombre: "Sin Datos",
            meta: 95,
            metaAlcanzada: 0,
            incidentesReportados: 0,
            tiempoPromedioResolucion: 0,
            cumplimiento: "Sin Datos"
        };
        
        if (!monthlyRecords || monthlyRecords.length === 0) return defaultKpi;
        return monthlyRecords.find(m => m.mesNumero === selectedMonth) || defaultKpi;
    }, [monthlyRecords, selectedMonth]);

    return {
        year,
        setYear,
        selectedMonth,
        setSelectedMonth,
        monthlyRecords,
        activeKpiData,
        isLoading,
        refresh: () => fetchSlaData(year, true)
    };
};