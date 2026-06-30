import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AXIOS_INSTANCE } from '../../api/axios-instance';

export interface HomeKPIsData {
  resolvedToday: number;
  activeTickets: number;
  totalDevices: number;
}

export const useHomeKPIs = () => {
  const { isAuthenticated } = useAuth();
  const [kpis, setKpis] = useState<HomeKPIsData>({
    resolvedToday: 0,
    activeTickets: 0,
    totalDevices: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchKPIs = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const ticketsResponse = await AXIOS_INSTANCE.get('/api/tickets?page=1&pageSize=1');
      const ticketsPagedData = ticketsResponse.data; 
      const devicesResponse = await AXIOS_INSTANCE.get('/api/devices?page=1&pageSize=1');
      const devicesPagedData = devicesResponse.data;
      setKpis({
        resolvedToday: ticketsPagedData?.resolvedTodayCount ?? 0, 
        activeTickets: ticketsPagedData?.activeTicketsCount ?? 0, 
        totalDevices: devicesPagedData?.totalItems ?? 0,        
      });

    } catch (error) {
      console.error("Error al recuperar las métricas desde el PagedResponseDto:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      if (isMounted) {
        await fetchKPIs();
      }
    };
    executeFetch();
    return () => {
      isMounted = false;
    };
  }, [fetchKPIs]);

  return { kpis, isLoading, refresh: fetchKPIs };
};