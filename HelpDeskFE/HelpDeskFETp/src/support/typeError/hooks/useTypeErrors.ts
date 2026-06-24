import { useState, useEffect, useCallback, useMemo } from 'react';
import { AXIOS_INSTANCE } from '../../../api/axios-instance'; 
import { getTypeError } from '../../../api/generated/type-error/type-error'; 
import type { GetApiTypeErrorsParams, CreateTypeErrorDto, UpdateTypeErrorDto } from '../../../api/model';

export interface TypeErrorItem {
  id: number;
  name: string;
  createdDate?: string;
}

export const useTypeErrors = (
  nameFilter: string,
  page: number,
  pageSize: number = 5
) => {
  const [typeErrors, setTypeErrors] = useState<TypeErrorItem[]>([]);
  const [typeError, setTypeError] = useState<TypeErrorItem | null>(null); 
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const service = useMemo(() => getTypeError(AXIOS_INSTANCE), []);

  const fetchTypeErrors = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: GetApiTypeErrorsParams = {
        Name: nameFilter || undefined,
        PageNumber: page,
        PageSize: pageSize,
      };

      const response = await service.getApiTypeErrors(params);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendResponse = response.data as any;

      setTypeErrors(backendResponse?.data || backendResponse || []);
      setTotalCount(backendResponse?.totalItems || backendResponse?.length || 0);
    } catch (error) {
      console.error('Error al consultar tipos de errores:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nameFilter, page, pageSize, service]);

  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      if (isMounted) {
        await fetchTypeErrors();
      }
    };
    executeFetch();
    return () => { isMounted = false; };
  }, [fetchTypeErrors]);

  const getTypeErrorById = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const response = await service.getApiTypeErrorsId(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resAny = response.data as any;
      
      const nameFromBackend = resAny?.data?.name || resAny?.Data?.name || resAny?.name || '';
      const idFromBackend = resAny?.data?.id || resAny?.Data?.id || resAny?.id || id;

      setTypeError({
        id: Number(idFromBackend),
        name: nameFromBackend
      });
    } catch (error) {
      console.error('Error al consultar tipo de error por ID:', error);
      setTypeError(null);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const createTypeError = async (data: CreateTypeErrorDto) => {
    setIsLoading(true);
    try {
      await service.postApiTypeErrors(data);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTypeError = async (id: number, data: UpdateTypeErrorDto) => {
    setIsLoading(true);
    try {
      await service.putApiTypeErrorsId(id, data);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTypeError = async (id: number) => {
    setIsLoading(true);
    try {
      await service.deleteApiTypeErrorsId(id);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    typeErrors,
    typeError,
    totalCount,
    isLoading,
    refresh: fetchTypeErrors,
    getTypeErrorById,
    createTypeError,
    updateTypeError,
    deleteTypeError
  };
};