import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../api/axios-instance";
import { getNotification } from "../../api/generated/notification/notification";

export interface NotificationItem {
  id: number;
  textMessage: string;
  isRead: boolean;
  idReference: number;
  createdDate: string;
  idUser: number;
  userName: string;
  idAlertType: number;
  alertTypeName: string;
}
export const useNotificationsTable = (
  searchTerm: string,
  isReadFilter: boolean | undefined,
  page: number,
  pageSize: number = 5,
) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [notification, setNotification] = useState<NotificationItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const notificationService = useMemo(() => getNotification(AXIOS_INSTANCE), []);

  // 1. Obtener listado paginado y filtrado
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const response = await notificationService.getApiNotifications({
        PageNumber: page,
        PageSize: pageSize,
        Keyword: searchTerm || undefined,
        IsRead: isReadFilter,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || [];
      const serverTotalItems = backendResponse?.totalItems || 0;

      const formattedData: NotificationItem[] = Array.isArray(rawData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? rawData.map((item: any) => ({
            id: item.id || 0,
            textMessage: item.textMessage || "Sin mensaje disponible",
            isRead: item.isRead ?? false,
            idReference: item.idReference || 0,
            createdDate: item.createdDate || "N/A",
            idUser: item.idUser || 0,
            userName: item.userName || item.user?.username || "Sistema",
            idAlertType: item.idAlertType || 0,
            alertTypeName: item.alertTypeName || "N/A",
          }))
        : [];

      setNotifications(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al cargar notificaciones mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, searchTerm, isReadFilter, page, pageSize, notificationService]);

  // 2. Obtener un registro individual por ID (Para tu Modal de Detalles)
  const getNotificationById = useCallback(async (id: number): Promise<NotificationItem | null> => {
    try {
      setIsFetching(true);
      const response = await notificationService.getApiNotificationsId(id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const item = backendResponse?.data || backendResponse;

      if (!item) {
        setNotification(null);
        return null;
      }

      const formatted: NotificationItem = {
        id: item.id || 0,
        textMessage: item.textMessage || "",
        isRead: item.isRead ?? false,
        idReference: item.idReference || 0,
        createdDate: item.createdDate || "",
        idUser: item.idUser || 0,
        userName: item.userName || "",
        idAlertType: item.idAlertType || 0,
        alertTypeName: item.alertTypeName || "",
      };

      setNotification(formatted);
      return formatted;
    } catch (error) {
      console.error(`Error al obtener detalle de notificación ${id}:`, error);
      setNotification(null);
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [notificationService]);

  const markAsRead = async (id: number) => {
    // Buscamos si la notificación ya está leída para no trabajar de balde
    const currentNotif = notifications.find(n => n.id === id) || notification;
    if (currentNotif && currentNotif.isRead) return; // Si ya está leída, no hace nada

    // 1. Actualización inmediata en la UI
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    if (notification && notification.id === id) {
      setNotification({ ...notification, isRead: true });
    }

    try {
      // 2. Llamada limpia a Orval pasando SOLO el ID 
      await notificationService.putApiNotificationsIdMarkAsRead(id);
    } catch (error) {
      console.error("Error al marcar como leído en el servidor:", error);
      
      // Rollback si el servidor se cae
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: false } : n)
      );
      if (notification && notification.id === id) {
        setNotification({ ...notification, isRead: false });
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchNotifications();
      }
    };

    const timeoutId = setTimeout(executeFetch, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchNotifications]);

  return {
    notifications,
    totalCount,
    isLoading,
    notification,
    isFetching,
    getNotificationById,
    markAsRead,
    refresh: fetchNotifications,
  };
};