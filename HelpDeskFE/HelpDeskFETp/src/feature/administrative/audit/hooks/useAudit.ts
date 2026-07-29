import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getAudit } from "../../../../api/generated/audit/audit";
import type { GetApiAuditParams } from "../../../../api/model";
import { getAuditLogExport } from "../../../../api/generated/audit-log-export/audit-log-export";

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
  const exportService = useMemo(() => getAuditLogExport(AXIOS_INSTANCE), []);

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

  const downloadExcel = async () => {
    try {
 
      const currentYear = new Date().getFullYear();

      const response = await exportService.getApiAuditLogExportExportExcel(
        {
          year: currentYear, 
          month: undefined,  
        },
        {
          responseType: "blob",
        },
      );

    
      const blob = new Blob([response.data as unknown as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

 
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

      link.setAttribute("download", `Auditoria_Logs_${dateStr}.xlsx`);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar resumen de logs a Excel:", error);
      throw error;
    }
  };

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
    downloadExcel,
    refresh: fetchLogs,
  };
};
