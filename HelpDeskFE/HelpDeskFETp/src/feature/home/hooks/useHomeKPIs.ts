import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { AXIOS_INSTANCE } from '../../../api/axios-instance';

export interface HomeKPIsData {
  resolvedToday: number;
  activeTickets: number;
  totalDevices: number;
}

export const useHomeKPIs = () => {
  const { isAuthenticated, user } = useAuth();
  
  const [kpis, setKpis] = useState<HomeKPIsData>({
    resolvedToday: 0,
    activeTickets: 0,
    totalDevices: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isCliente = user?.roles.some(r => r.toLowerCase() === 'cliente') ?? false;

  const fetchKPIs = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const ticketsResponse = await AXIOS_INSTANCE.get('/api/tickets?pageNumber=1&pageSize=1');
      const ticketsPagedData = ticketsResponse.data; 

      let totalDevicesCount = 0;
    
      if (!isCliente) {
        try {
          const devicesResponse = await AXIOS_INSTANCE.get('/api/devices?pageNumber=1&pageSize=1');
          totalDevicesCount = devicesResponse.data?.totalItems ?? 0;
        } catch (deviceError) {
          console.error("Error aislado al recuperar dispositivos (Admin/TI):", deviceError);
        }
      }

      setKpis({
        resolvedToday: ticketsPagedData?.resolvedTodayCount ?? 0, 
        activeTickets: ticketsPagedData?.activeTicketsCount ?? 0, 
        totalDevices: totalDevicesCount,        
      });

    } catch (error) {
      console.error("Error al recuperar las métricas desde el PagedResponseDto:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isCliente]); 

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