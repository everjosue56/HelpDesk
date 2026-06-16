import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../api/axios-instance";
import { getAudit } from "../../../api/generated/audit/audit";
import type { GetApiAuditParams } from "../../../api/model";

export interface AuditLogItem {
  id: number;
  userName: string;
  action: string;
  tableName: string;
  description: string;
  createdAt: string;
}

export const useAudit = (
  searchTerm: string,
  page: number,
  pageSize: number = 10,
) => {
  const { isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Inicializamos el servicio de Orval una sola vez
  const auditService = useMemo(() => getAudit(AXIOS_INSTANCE), []);

  const fetchLogs = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const params: GetApiAuditParams = {
        Keyword: searchTerm || undefined,
        PageNumber: page,
        PageSize: pageSize,
      };

      const response = await auditService.getApiAudit(params);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;

      console.log("=== DATOS DE PAGINACIÓN EN EL FRONT ===", {
        dataRaiz: backendResponse,
        totalCountProp: backendResponse?.totalCount,
        totalRecordsProp: backendResponse?.totalRecords,
        totalItemsProp: backendResponse?.totalItems,
      });
      const rawData = backendResponse?.data || [];

      // Mapeo
      const serverTotalItems =
        backendResponse?.totalCount ??
        backendResponse?.totalRecords ??
        backendResponse?.totalItems ??
        backendResponse?.total ??
        0;
      const formattedData: AuditLogItem[] = Array.isArray(rawData)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawData.map((item: any) => ({
            id: item.id || 0,
            userName: item.userName || "Sistema/Anónimo",
            action: item.action || "DESCONOCIDO",
            tableName: item.tableName || "N/A",
            description: item.description || "Sin descripción",
            createdAt: item.createdAt || "N/A",
          }))
        : [];

      setLogs(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al cargar la bitácora mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, searchTerm, page, pageSize, auditService]); 

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchLogs();
      }
    };

    const timeoutId = setTimeout(executeFetch, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchLogs]);

  return {
    logs,
    totalCount,
    isLoading,
    refresh: fetchLogs,
  };
};
