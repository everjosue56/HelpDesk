import { useState, useEffect, useCallback } from 'react';
import { AXIOS_INSTANCE } from '../../../../api/axios-instance';

export interface MaintenanceStatusDto {
    estado: string;
    cantidad: number;
    color: string;
}

export interface MaintenanceFrequencyChartDto {
    frecuencia: string;
    cantidad: number;
}

export interface MaintenanceAreaChartDto {
    area: string;
    cantidad: number;
}

export interface MaintenanceMonthlyHistoryDto {
    mesNumero: number;
    mesNombre: string;
    cantidad: number;
}

export interface MaintenanceDashboardData {
    totalProgramados: number;
    totalRealizados: number;
    totalVencidos: number;
    tiempoTotalEjecucion: number;
    porEstado: MaintenanceStatusDto[];
    porFrecuencia: MaintenanceFrequencyChartDto[];
    porArea: MaintenanceAreaChartDto[];
    historialMensual: MaintenanceMonthlyHistoryDto[];
}

export const useMaintenanceDashboard = (initialYear: number = new Date().getFullYear()) => {
    const [year, setYear] = useState<number>(initialYear);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
    const [data, setData] = useState<MaintenanceDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchDashboardData = useCallback(async (targetYear: number, targetMonth?: number) => {
        try {
            setIsLoading(true);
            const response = await AXIOS_INSTANCE.get<MaintenanceDashboardData>('/api/dashboard/mantenimientos', {
                params: {
                    year: targetYear,
                    month: targetMonth
                }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener las métricas del dashboard de mantenimiento:", error);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData(year, selectedMonth);
    }, [year, selectedMonth, fetchDashboardData]);

    return {
        year,
        setYear,
        selectedMonth,
        setSelectedMonth,
        data,
        isLoading,
        refresh: () => fetchDashboardData(year, selectedMonth)
    };
};
