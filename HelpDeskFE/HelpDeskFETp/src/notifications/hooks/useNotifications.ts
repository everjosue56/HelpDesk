import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { AXIOS_INSTANCE } from '../../api/axios-instance';
import { getNotification } from '../../api/generated/notification/notification'; 
import type { NotificationDto } from '../../api/model';

export const useNotifications = () => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const notificationsService = getNotification(AXIOS_INSTANCE);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    
    try {
      setIsLoading(true);

      const response = await notificationsService.getApiNotificationsUnreadUserUserId(user.id);
      const backendResponse = response.data as any;
      const data: NotificationDto[] = backendResponse?.data || backendResponse || [];
      
      setNotifications(data);
      
      // Filtramos y contamos las alertas no leídas (.isRead === false)
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error al cargar notificaciones mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const markAsRead = async (id: number) => {
    try {
      await notificationsService.putApiNotificationsIdMarkAsRead(id);
  
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error al marcar la notificación como leída:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      if (isMounted) {
        await fetchNotifications();
      }
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    refresh: fetchNotifications,
    markAsRead
  };
};