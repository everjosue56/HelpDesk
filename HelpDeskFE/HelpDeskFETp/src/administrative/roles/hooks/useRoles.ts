import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../api/axios-instance";
import { getRoles } from "../../../api/generated/roles/roles"; 

export interface RoleItem {
  id: number;
  name: string;
  description: string;
  permissionLevel: string;
}

export const useRoles = () => {
  const { isAuthenticated } = useAuth();
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const roleService = useMemo(() => getRoles(AXIOS_INSTANCE), []);

  const fetchRoles = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      // Consumimos el endpoint de tu chepia
      const response = await roleService.getApiRoles(); 

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      
      // Mapeo flexible para interceptar 
      const rawData = backendResponse?.data || backendResponse || [];

      const formattedData: RoleItem[] = Array.isArray(rawData)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? rawData.map((item: any) => {
      // Obtenemos el nombre del rol desde cualquier propiedad posible que mande Orval
      const roleName = (item.nameRol || item.name || "").trim();
      const lowerName = roleName.toLowerCase();
      
      // Valores por defecto (Fallback seguro)
      let description = "Interfaz operativa para el usuario solicitante. Permite la autogestión en la apertura de reportes de incidentes, seguimiento en tiempo real del estado de sus requerimientos y la actualización segura de sus credenciales de acceso..";
      let permissionLevel = "Usuario Final";

      // 1. Caso Administrador
      if (lowerName.includes("administrador") || lowerName.includes("admin")) {
        description = "Supervisión global de la plataforma. Posee facultades plenas para la auditoría del sistema, aprovisionamiento de infraestructura corporativa, configuración de seguridad y gobernanza sobre el ciclo de vida de agencias, áreas y usuarios.";
        permissionLevel = "Acceso Total";
      } 
      // 2. Caso Técnico / TI 
      else if (lowerName.includes("tecnico") || lowerName === "ti" || lowerName.includes("soporte") || lowerName.includes("it")) {
        description = "Gestión operativa y técnica del Service Desk. Encargado del control y trazabilidad de inventarios informáticos, así como del ciclo integral de atención, diagnóstico, escalamiento y resolución de tickets e incidentes asignados.";
        permissionLevel = "Soporte Técnico";
      }
      // 3. Caso Cliente / Usuario Final explicito
      else if (lowerName.includes("cliente") || lowerName.includes("usuario")) {
        description = "Interfaz operativa para el usuario solicitante. Permite la autogestión en la apertura de reportes de incidentes, seguimiento en tiempo real del estado de sus requerimientos y la actualización segura de sus credenciales de acceso.";
        permissionLevel = "Usuario Final";
      }

      return {
        id: item.id || 0,
        name: roleName || "Sin Nombre",
        description,      
        permissionLevel,  
      };
    })
  : [];
      setRoles(formattedData);
      setTotalCount(formattedData.length);
    } catch (error) {
      console.error("Error al cargar los roles mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, roleService]);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchRoles();
      }
    };
    const timeoutId = setTimeout(executeFetch, 0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchRoles]);

  return {
    roles,
    totalCount,
    isLoading,
    refresh: fetchRoles,
  };
};