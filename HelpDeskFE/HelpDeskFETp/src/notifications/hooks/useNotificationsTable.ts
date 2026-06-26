import { useState, useEffect, useCallback, useMemo } from 'react';
import { AXIOS_INSTANCE } from '../../api/axios-instance';
import { getNotification } from '../../api/generated/notification/notification';

export interface NotificationRow {
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

export const useNotificationsTable = (initialPageSize = 6) => {
    const [notifications, setNotifications] = useState<NotificationRow[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Estados para los filtros interactivos
    const [keyword, setKeyword] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<number | undefined>(undefined);
    const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>(undefined);
    const [selectedAlertType, setSelectedAlertType] = useState<number | undefined>(undefined);
    const [page, setPage] = useState<number>(1);

    const service = useMemo(() => getNotification(AXIOS_INSTANCE), []);

    const fetchNotificationsData = useCallback(async (isMounted: boolean) => {
        try {
            if (isMounted) setIsLoading(true);
            
            const response = await service.getApiNotifications({
                Keyword: keyword || undefined,
                IdUser: selectedUser || undefined,
                IsRead: isReadFilter,
                IdAlertType: selectedAlertType || undefined,
                PageNumber: page,
                PageSize: initialPageSize
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const backendResponse = response.data as any;
            const data = backendResponse?.data || backendResponse?.Data || backendResponse || [];
            
            if (isMounted) {
                setNotifications(data);
                
                // 🚀 Ajuste: Buscamos las propiedades de paginación típicas del DTO de SystemdeLuxe
                const total = backendResponse?.totalRecords ?? 
                              backendResponse?.TotalRecords ?? 
                              backendResponse?.totalCount ?? 
                              backendResponse?.TotalCount ?? 
                              data.length;
                              
                setTotalCount(total);
            }
        } catch (error) {
            console.error("Error al recuperar listado de notificaciones:", error);
            if (isMounted) setNotifications([]);
        } finally {
            if (isMounted) setIsLoading(false);
        }
    }, [keyword, selectedUser, isReadFilter, selectedAlertType, page, initialPageSize, service]);

    // Switch optimista de lectura
    const toggleReadStatus = useCallback(async (id: number, currentStatus: boolean) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !currentStatus } : n));
        
        try {
            await service.putApiNotificationsIdMarkAsRead(id);
        } catch (error) {
            console.error("Error al mutar estado de lectura:", error);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: currentStatus } : n));
        }
    }, [service]);

    // 🚀 EFECTO CONTROLADO: Agregamos un debounce implícito de 400ms para la búsqueda por teclado
    useEffect(() => {
        let isMounted = true;
        
        const delayDebounceFn = setTimeout(async () => {
            await fetchNotificationsData(isMounted);
        }, 400); // Espera a que el usuario termine de teclear para no saturar a SQL Server

        return () => {
            isMounted = false;
            clearTimeout(delayDebounceFn);
        };
    }, [fetchNotificationsData]);

    return {
        notifications,
        totalCount,
        isLoading,
        page,
        setPage,
        keyword,
        setKeyword,
        selectedUser,
        setSelectedUser,
        isReadFilter,
        setIsReadFilter,
        selectedAlertType,
        setSelectedAlertType,
        toggleReadStatus,
        refresh: () => fetchNotificationsData(true)
    };
};