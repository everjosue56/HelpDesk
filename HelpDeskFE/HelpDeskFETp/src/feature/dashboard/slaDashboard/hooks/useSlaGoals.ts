import { useState, useCallback } from 'react';
import { AXIOS_INSTANCE } from '../../../../api/axios-instance';
import { toast } from 'sonner';

export interface SaveSlaGoalPayload {
    year: number;
    month: number;
    goalValue: number;
}

export const useSlaGoals = (onSuccessCallback?: () => void) => {
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const saveMonthGoal = useCallback(async (payload: SaveSlaGoalPayload) => {
        try {
            setIsSaving(true);
            
    
            const response = await AXIOS_INSTANCE.post('/api/sla-goals', payload);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const backendResponse = response.data as any;
 
            if (backendResponse?.status || backendResponse?.Status) {
                if (onSuccessCallback) onSuccessCallback();
                return true;
            } else {
                toast.error(backendResponse?.message || "Error al guardar la meta.");
                return false;
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error al guardar la meta del SLA:", error);
            const errorMessage = error?.response?.data?.message || "Error de comunicación con el servidor.";
            toast.error(errorMessage);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [onSuccessCallback]);

    return {
        saveMonthGoal,
        isSaving
    };
};