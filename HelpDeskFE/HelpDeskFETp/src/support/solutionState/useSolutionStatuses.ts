import { useState, useEffect, useCallback, useMemo } from "react";
import { AXIOS_INSTANCE } from "../../api/axios-instance";
import { getSolutionState } from "../../api/generated/solution-state/solution-state"; 

export const useSolutionStatuses = () => {
    const [solutionStatuses, setSolutionStatuses] = useState<{ id: number; name: string }[]>([]);
    const [isLoadingStatuses, setIsLoadingStatuses] = useState(false);

    const service = useMemo(() => getSolutionState(AXIOS_INSTANCE), []);

    const fetchStatuses = useCallback(async (isMounted: boolean = true) => {
        try {
            if (isMounted) setIsLoadingStatuses(true);
            const response = await service.getApiSolutionState();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const backendResponse = response.data as any;
            
            if (isMounted) {
                setSolutionStatuses(backendResponse?.data || backendResponse?.Data || backendResponse || []);
            }
        } catch (error) {
            console.error("Error al consultar los estados de solución desde la API:", error);
            if (isMounted) setSolutionStatuses([]);
        } finally {
            if (isMounted) setIsLoadingStatuses(false);
        }
    }, [service]);

    // 🚀 CORRECCIÓN: Manejo asíncrono y seguro para evitar renders en cascada según ESLint
    useEffect(() => {
        let isMounted = true;

        const executeFetch = async () => {
            await fetchStatuses(isMounted);
        };

        executeFetch();

        return () => { 
            isMounted = false; 
        };
    }, [fetchStatuses]);

    return {
        solutionStatuses,
        isLoadingStatuses,
        refreshStatuses: () => fetchStatuses(true)
    };
};