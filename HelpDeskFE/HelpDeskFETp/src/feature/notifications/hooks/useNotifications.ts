import { useState, useEffect, useCallback, useMemo } from 'react';
import { AXIOS_INSTANCE } from '../../../api/axios-instance';
import { getNotification } from '../../../api/generated/notification/notification'; 
import { toast } from 'sonner';

export interface NotificationItem {
    id: number;
    textMessage: string;
    sentAt: string | null;
    isRead: boolean;
    idReference: number;
    createdDate: string;
    idUser: number;
    userEmail: string;
    userName: string;
    idAlertType: number;
    alertTypeName: string;
}

export const useNotifications = (userId: number) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const service = useMemo(() => getNotification(AXIOS_INSTANCE), []);

    const fetchUnreadNotifications = useCallback(async (isMounted: boolean) => {
        if (!userId) return;
        try {
            if (isMounted) setIsLoading(true);
            const response = await service.getApiNotificationsUnreadUserUserId(userId);
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const backendResponse = response.data as any;
            const data = backendResponse?.data || backendResponse?.Data || backendResponse || [];
            
            if (isMounted) {
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error al recuperar las notificaciones:", error);
            if (isMounted) setNotifications([]);
        } finally {
            if (isMounted) setIsLoading(false);
        }
    }, [userId, service]);

    const markAsRead = useCallback(async (notificationId: number) => {
        const previousNotifications = [...notifications];
        
        setNotifications(prev => prev.filter(n => n.id !== notificationId));

        try {
            const response = await service.putApiNotificationsIdMarkAsRead(notificationId);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const backendResponse = response.data as any;
            
            const isSuccess = backendResponse?.data ?? backendResponse?.Data ?? backendResponse ?? false;

            if (!isSuccess) {
                throw new Error("El backend no procesó el cambio");
            }
        } catch (error) {
            console.error("Error al marcar la notificación como leída:", error);
            toast.error("No se pudo marcar la notificación como leída");
            // Hacemos rollback si la red falló
            setNotifications(previousNotifications);
        }
    }, [notifications, service]);

    //  3. Marcar TODAS como leídas 
    const markAllAsRead = useCallback(async () => {
        if (notifications.length === 0) return;
        const previousNotifications = [...notifications];
        setNotifications([]);

        try {
            await Promise.all(notifications.map(n => service.putApiNotificationsIdMarkAsRead(n.id)));
            toast.success("Notificaciones limpiadas");
        } catch (error) {
            console.error("Error al limpiar todas las notificaciones:", error);
            setNotifications(previousNotifications);
        }
    }, [notifications, service]);

   useEffect(() => {
        let isMounted = true;

        const executeFetch = async () => {
            await fetchUnreadNotifications(isMounted);
        };

        executeFetch();
        
        return () => { 
            isMounted = false; 
        };
    }, [userId, fetchUnreadNotifications]);
    const unreadCount = useMemo(() => notifications.length, [notifications]);

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        refresh: () => fetchUnreadNotifications(true)
    };
};