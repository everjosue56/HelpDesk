import { useState, useEffect, useCallback, useMemo } from "react";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getSoftwareSystem } from "../../../../api/generated/software-system/software-system";
import type {
  GetApiSoftwareSystemsParams,
  CreateSoftwareSystemDto,
  UpdateSoftwareSystemDto,
} from "../../../../api/model";

export interface SoftwareSystemItem {
  id: number;
  name: string;
  createdDate: string;
}

export const useSoftwareSystems = (
  nameFilter: string,
  page: number,
  pageSize: number = 5,
) => {
  const [systems, setSystems] = useState<SoftwareSystemItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const service = useMemo(() => getSoftwareSystem(AXIOS_INSTANCE), []);

  const fetchSystems = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: GetApiSoftwareSystemsParams = {
        Name: nameFilter || undefined,
        PageNumber: page,
        PageSize: pageSize,
      };

      const response = await service.getApiSoftwareSystems(params);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;

      setSystems(backendResponse?.data || backendResponse || []);
      setTotalCount(
        backendResponse?.totalItems || backendResponse?.length || 0,
      );
    } catch (error) {
      console.error("Error al consultar sistemas de software:", error);
    } finally {
      setIsLoading(false);
    }
  }, [nameFilter, page, pageSize, service]);

  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      if (isMounted) {
        await fetchSystems();
      }
    };
    executeFetch();
    return () => {
      isMounted = false;
    };
  }, [fetchSystems]);

  const createSystem = async (data: CreateSoftwareSystemDto) => {
    setIsLoading(true);
    try {
      await service.postApiSoftwareSystems(data);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSystem = async (id: number, data: UpdateSoftwareSystemDto) => {
    setIsLoading(true);
    try {
      await service.putApiSoftwareSystemsId(id, data);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSystem = async (id: number) => {
    setIsLoading(true);
    try {
      await service.deleteApiSoftwareSystemsId(id);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    systems,
    totalCount,
    isLoading,
    refresh: fetchSystems,
    createSystem,
    updateSystem,
    deleteSystem,
  };
};
