import { useState, useEffect, useCallback, useMemo } from "react";
import { AXIOS_INSTANCE } from "../../../api/axios-instance";
import { getDashboard } from "../../../api/generated/dashboard/dashboard";

export interface AreaPerformanceData {
  areaNombre: string;
  cantidadTickets: number;
  porcentajeDelTotal: number;
}

export const useAreasDashboard = (initialYear: number = 2026) => {
  const [year, setYear] = useState<number>(initialYear);
  const [month, setMonth] = useState<number | undefined>(
    new Date().getMonth() + 1,
  );
  const [idAgency, setIdAgency] = useState<number | undefined>(undefined);

  const [areasRecords, setAreasRecords] = useState<AreaPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const service = useMemo(() => getDashboard(AXIOS_INSTANCE), []);

  const fetchAreasData = useCallback(
    async (
      targetYear: number,
      targetMonth: number | undefined,
      targetAgency: number | undefined,
      isMounted: boolean,
    ) => {
      try {
        if (isMounted) setIsLoading(true);

        const response = await service.getApiDashboardCargaAreas({
          year: targetYear,
          month: targetMonth || undefined,
          agency: targetAgency || undefined,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendResponse = response.data as any;

        if (isMounted) {
          const data =
            backendResponse?.data ||
            backendResponse?.Data ||
            backendResponse ||
            [];
          setAreasRecords(data);
        }
      } catch (error) {
        console.error("Error al recuperar las métricas de áreas:", error);
        if (isMounted) setAreasRecords([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    },
    [service],
  );

  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      await fetchAreasData(year, month, idAgency, isMounted);
    };
    executeFetch();
    return () => {
      isMounted = false;
    };
  }, [year, month, idAgency, fetchAreasData]);

  const kpis = useMemo(() => {
    const totalTickets = areasRecords.reduce(
      (acc, curr) => acc + (curr.cantidadTickets || 0),
      0,
    );
    const totalAreas = areasRecords.length;
    return { totalTickets, totalAreas };
  }, [areasRecords]);

  return {
    year,
    setYear,
    month,
    setMonth,
    idAgency,
    setIdAgency,
    areasRecords,
    kpis,
    isLoading,
    refresh: () => fetchAreasData(year, month, idAgency, true),
  };
};
