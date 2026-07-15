import { AXIOS_INSTANCE } from './axios-instance';

 
export const claimTicket = async (ticketId: number) => {
    try {
        const response = await AXIOS_INSTANCE.put(`/api/tickets/${ticketId}/claim`);
        return response.data;  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error en claimTicket service:", error);
        throw error;
    }
};