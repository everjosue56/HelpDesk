import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext'; 
import { AXIOS_INSTANCE } from '../../../api/axios-instance';
import { getOrganizations } from '../../../api/generated/organizations/organizations'; 
import type { CreateOrganizationDto, UpdateOrganizationDto, OrganizationDtoResponseDto } from '../../../api/model';

export interface OrganizationItem {
  id: number;
  name: string;
  contact?: string;
  address?: string;
  description?: string,
  logo?: string;
  createDate?: string;
}

export const useOrganizations = (searchTerm: string, page: number, pageSize: number = 5) => {
  const { isAuthenticated } = useAuth();
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [organization, setOrganization] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const organizationService = useMemo(() => getOrganizations(AXIOS_INSTANCE), []);

  const fetchOrganizations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);
      
      const response = await organizationService.getApiOrganizations({
        pageNumber: page,
        pageSize: pageSize,
        name: searchTerm || undefined 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;
      const rawData = backendResponse?.data || [];
      const serverTotalItems = backendResponse?.totalItems || 0;

      const formattedData: OrganizationItem[] = Array.isArray(rawData) 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? rawData.map((org: any) => ({
            id: org.id || 0,
            name: org.name || 'Sin Nombre',
            contact: org.phoneNumber || org.contact || 'N/A', 
            address: org.address || 'N/A',
            description: org.description  || "N/A",
            logo: org.logo || '',
            createDate: org.createDate || "N/A"
          }))
        : [];

      setOrganizations(formattedData);
      setTotalCount(serverTotalItems); 
    } catch (error) {
      console.error("Error al cargar organizaciones mediante Orval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, searchTerm, page, pageSize, organizationService]);


  const getOrganizationById = useCallback(async (id: number): Promise<OrganizationItem | null> => {
    try {
      setIsFetching(true); // Enciende el spinner de carga para el Edit/Detail
      const response = await organizationService.getApiOrganizationsId(id);
      
      const backendResponse = response.data as unknown as OrganizationDtoResponseDto;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const org = (backendResponse as any)?.data || backendResponse;
      
      if (!org) {
        setOrganization(null);
        return null;
      }

      const formatted: OrganizationItem = {
        id: org.id || 0,
        name: org.name || 'Sin Nombre',
        contact: org.phoneNumber || org.contact || '',
        address: org.address || '',
        description: org.description || '',
        logo: org.logo || '',
        createDate: org.createDate || 'N/A'  
      };

      setOrganization(formatted); 
      return formatted;
    } catch (error) {
      console.error(`Error al obtener detalle de organización con id ${id}:`, error);
      setOrganization(null);
      return null;
    } finally {
      setIsFetching(false); 
    }
  }, [organizationService]);

  const createOrganization = async (dto: CreateOrganizationDto) => {
    try {
      setIsLoading(true);
      await organizationService.postApiOrganizations(dto);
      await fetchOrganizations(); 
    } catch (error) {
      console.error("Error al crear la organización:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrganization = async (id: number, dto: UpdateOrganizationDto) => {
    try {
      setIsLoading(true);
      await organizationService.putApiOrganizationsId(id, dto);
      await fetchOrganizations(); 
    } catch (error) {
      console.error("Error al actualizar la organización:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrganization = async (id: number) => {
    try {
      setIsLoading(true);
      await organizationService.deleteApiOrganizationsId(id);
      await fetchOrganizations();
    } catch (error) {
      console.error("Error al eliminar la organización:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      if (isMounted) await fetchOrganizations();
    };
    const timeoutId = setTimeout(executeFetch, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchOrganizations]);

  return {
    organizations,
    totalCount, 
    isLoading,       
    organization,     
    isFetching,        
    refresh: fetchOrganizations,
    getOrganizationById, 
    createOrganization,
    updateOrganization,
    deleteOrganization
  };
};