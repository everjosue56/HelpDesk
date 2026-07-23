import { useState, useEffect, useCallback, useMemo } from 'react';
import { AXIOS_INSTANCE } from '../../../../api/axios-instance';
import { getDashboard } from '../../../../api/generated/dashboard/dashboard';
// 🚀 Importamos el cliente autogenerado de exportación
import { getMaintenanceExport } from '../../../../api/generated/maintenance-export/maintenance-export'; 

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

interface MaintenanceDashboardResponse {
    data?: MaintenanceDashboardData | Record<string, unknown>;
    [key: string]: unknown;
}

export const normalizeMaintenanceDashboardPayload = (
    payload: unknown,
): MaintenanceDashboardData | null => {
    if (!payload || typeof payload !== 'object') return null;

    const candidate = (payload as MaintenanceDashboardResponse).data ?? payload;
    const record = candidate as Partial<MaintenanceDashboardData> & Record<string, unknown>;

    if (!record || typeof record !== 'object') return null;

    return {
        totalProgramados: Number(record.totalProgramados ?? 0),
        totalRealizados: Number(record.totalRealizados ?? 0),
        totalVencidos: Number(record.totalVencidos ?? 0),
        tiempoTotalEjecucion: Number(record.tiempoTotalEjecucion ?? 0),
        porEstado: Array.isArray(record.porEstado) ? (record.porEstado as MaintenanceStatusDto[]) : [],
        porFrecuencia: Array.isArray(record.porFrecuencia) ? (record.porFrecuencia as MaintenanceFrequencyChartDto[]) : [],
        porArea: Array.isArray(record.porArea) ? (record.porArea as MaintenanceAreaChartDto[]) : [],
        historialMensual: Array.isArray(record.historialMensual) ? (record.historialMensual as MaintenanceMonthlyHistoryDto[]) : [],
    };
};

export const useMaintenanceDashboard = (initialYear: number = 2026) => {
    const [year, setYear] = useState<number>(initialYear);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
        new Date().getMonth() + 1,
    );

    const [data, setData] = useState<MaintenanceDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Servicios de Orval instanciados
    const service = useMemo(() => getDashboard(AXIOS_INSTANCE), []);
    const exportService = useMemo(() => getMaintenanceExport(AXIOS_INSTANCE), []); // 👈 Instanciamos el servicio de exportación

    const fetchDashboardData = useCallback(
        async (
            targetYear: number,
            targetMonth: number | undefined,
            isMounted: boolean,
        ) => {
            try {
                if (isMounted) setIsLoading(true);

                const response = await service.getApiDashboardDashboardStats({
                    year: targetYear,
                    month: targetMonth ?? undefined,
                });

                if (isMounted) {
                    const normalizedData = normalizeMaintenanceDashboardPayload(response.data);
                    setData(normalizedData);
                }
            } catch (error) {
                console.error('Error al obtener las métricas del dashboard de mantenimiento:', error);
                if (isMounted) setData(null);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        },
        [service],
    );

    // 🚀 EXPORTACIÓN EXCEL USANDO EL CLIENTE ORVAL GENERADO
    const downloadExcel = async () => {
        try {
            const response = await exportService.getApiMaintenancesExportExportExcel(
                {
                    year,
                    month: selectedMonth,
                },
                {
                    responseType: 'blob', // 👈 Le pasamos responseType 'blob' en el AxiosRequestConfig
                }
            );

            // Crear y forzar descarga del Blob binario (.xlsx)
            const blob = new Blob([response.data as unknown as BlobPart], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const nombreMes = selectedMonth ? String(selectedMonth).padStart(2, '0') : 'Anual';
            link.setAttribute('download', `Reporte_Mantenimientos_${year}_${nombreMes}.xlsx`);

            document.body.appendChild(link);
            link.click();

            // Limpieza en memoria DOM
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al exportar Excel desde el cliente de Orval:', error);
            throw error;
        }
    };

    useEffect(() => {
        let isMounted = true;
        const executeFetch = async () => {
            await fetchDashboardData(year, selectedMonth, isMounted);
        };
        executeFetch();
        return () => {
            isMounted = false;
        };
    }, [year, selectedMonth, fetchDashboardData]);

    return {
        year,
        setYear,
        selectedMonth,
        setSelectedMonth,
        data,
        isLoading,
        downloadExcel,
        refresh: () => fetchDashboardData(year, selectedMonth, true),
    };
};