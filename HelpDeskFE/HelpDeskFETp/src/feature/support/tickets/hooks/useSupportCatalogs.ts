import { useState, useEffect, useCallback, useMemo } from 'react';
import { AXIOS_INSTANCE } from '../../../../api/axios-instance'; 
import { getPriority } from '../../../../api/generated/priority/priority'; 
import { getImpact } from '../../../../api/generated/impact/impact'; 

export interface CatalogItem {
  id: number;
  name: string;
}

export const useSupportCatalogs = () => {
  const [priorities, setPriorities] = useState<CatalogItem[]>([]);
  const [impacts, setImpacts] = useState<CatalogItem[]>([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false);

  const priorityService = useMemo(() => getPriority(AXIOS_INSTANCE), []);
  const impactService = useMemo(() => getImpact(AXIOS_INSTANCE), []);

  const fetchCatalogs = useCallback(async () => {
    setIsLoadingCatalogs(true);
    try {
      const params = { PageNumber: 1, PageSize: 100 };

      const [priorityRes, impactRes] = await Promise.all([
        priorityService.getApiPriority(params),
        impactService.getApiImpacts(params)
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pData = priorityRes.data as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const iData = impactRes.data as any;

      setPriorities(pData?.data || pData || []);
      setImpacts(iData?.data || iData || []);
    } catch (error) {
      console.error("Error al cargar catálogos maestros de soporte:", error);
    } finally {
      setIsLoadingCatalogs(false);
    }
  }, [priorityService, impactService]);

  useEffect(() => {
  let isMounted = true;

  const executeFetch = async () => {
    if (isMounted) {
      await fetchCatalogs();
    }
  };

  executeFetch();

  return () => {
    isMounted = false;
  };
}, [fetchCatalogs]);

  return {
    priorities,
    impacts,
    isLoadingCatalogs,
    refreshCatalogs: fetchCatalogs
  };
};