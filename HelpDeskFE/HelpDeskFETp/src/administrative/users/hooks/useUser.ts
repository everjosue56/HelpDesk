import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { AXIOS_INSTANCE } from "../../../api/axios-instance";
import { getUsers } from "../../../api/generated/users/users";
import type { UserRegisterDto, UpdateUserDto } from "../../../api/model";

export interface UserItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  roleName: string;
  idRol: number;
  agencyName: string;
  idAgency: number;
  areaName: string;
  idArea: number;
  isActive: boolean;
  createdDate?: string;
}

export const useUsers = (
  keyword: string,
  idRol: number | null,
  idAgency: number | null,
  idArea: number | null,
  isActive: boolean | null,
  page: number,
  pageSize: number = 5,
) => {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [user, setUser] = useState<UserItem | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // estado para los kpis
  const [totalActivos, setTotalActivos] = useState<number>(0);
  const [totalInactivos, setTotalInactivos] = useState<number>(0);

  // Inicialización del servicio de Orval
  const userService = useMemo(() => getUsers(AXIOS_INSTANCE), []);

  // 1. Obtener listado paginado y filtrado de usuarios
  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      const response = await userService.getApiUsers({
        PageNumber: page,
        PageSize: pageSize,
        Keyword: keyword || undefined,
        IdRol: idRol || undefined,
        IdAgency: idAgency || undefined,
        IdArea: idArea || undefined,
        IsActive: isActive !== null ? isActive : undefined,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      setTotalCount(backendResponse?.totalItems || 0);
      setTotalActivos(backendResponse?.totalActivos || 0);
      setTotalInactivos(backendResponse?.totalInactivos || 0);

      const rawData = backendResponse?.data || [];
      const serverTotalItems = backendResponse?.totalItems || 0;

      const formattedData: UserItem[] = Array.isArray(rawData)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawData.map((item: any) => ({
            id: item.id || 0,
            firstName: item.firstName || item.name || "Sin Nombre",
            lastName: item.lastName || item.name || "Sin Nombre",
            userName: item.userName || "N/A",
            phoneNumber: item.phoneNumber || "N/A",
            email: item.email || "N/A",
            roleName: item.roleName || item.roles?.name || "N/A",
            idRol: item.idRol || item.roles?.id || 0,
            agencyName: item.agencyName || item.agency?.name || "N/A",
            idAgency: item.idAgency || item.agency?.id || 0,
            areaName: item.areaName || item.area?.name || "N/A",
            idArea: item.idArea || item.area?.id || 0,
            isActive: item.isActive ?? true,
            createdDate: item.createdDate || "N/A",
          }))
        : [];

      setUsers(formattedData);
      setTotalCount(serverTotalItems);
    } catch (error) {
      console.error("Error al cargar usuarios mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    keyword,
    idRol,
    idAgency,
    idArea,
    isActive,
    page,
    pageSize,
    userService,
  ]);

  // 2. Obtener usuario individual por ID
  const getUserById = useCallback(
    async (id: number): Promise<UserItem | null> => {
      try {
        setIsFetching(true);
        const response = await userService.getApiUsersId(id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendResponse = response.data as any;
        const item = backendResponse?.data || backendResponse;

        if (!item) {
          setUser(null);
          return null;
        }

        const formatted: UserItem = {
          id: item.id || 0,
          firstName: item.firstName || "",
          lastName: item.lastName || "",
          userName: item.userName || "",
          phoneNumber: item.phoneNumber || "",
          email: item.email || "",
          roleName: item.roleName || "",
          isActive: item.isActive ?? true,
          createdDate: item.createdDate,
          idRol: item.idRol || item.roles?.id || 0,
          idAgency: item.idAgency || item.agency?.id || 0,
          idArea: item.idArea || item.area?.id || 0,
          agencyName:
            item.agencyName || (item.agency ? item.agency.name : "N/A"),
          areaName: item.areaName || (item.area ? item.area.name : "N/A"),
        };

        setUser(formatted);
        return formatted;
      } catch (error) {
        console.error(`Error al obtener detalle de usuario ${id}:`, error);
        setUser(null);
        return null;
      } finally {
        setIsFetching(false);
      }
    },
    [userService],
  );

  // 3. Mutaciones CRUD (Registro/Post, Put, Delete)
  const createUser = async (dto: UserRegisterDto) => {
    try {
      setIsLoading(true);
      await userService.postApiUsersRegister(dto);
      await fetchUsers();
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: number, dto: UpdateUserDto) => {
    try {
      setIsLoading(true);
      await userService.putApiUsersId(id, dto);
      await fetchUsers();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      setIsLoading(true);
      await userService.deleteApiUsersId(id);
      await fetchUsers();
    } catch (error) {
      console.error("Error al desactivar el usuario:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchUsers();
      }
    };

    const timeoutId = setTimeout(executeFetch, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchUsers]);

  return {
    users,
    totalCount,
    isLoading,
    user,
    isFetching,
    totalActivos,
    totalInactivos,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    refresh: fetchUsers,
  };
};
