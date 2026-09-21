import { useCallback, useEffect, useMemo, useState } from "react";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getSupplier } from "../../../../api/generated/supplier/supplier";
import type {
  CreateSupplierDto,
  UpdateSupplierDto,
} from "../../../../api/model";

export interface SupplierItem {
  id: number;
  idOrganization: number;
  organizationName: string;
  name: string;
  description: string;
  contact: string;
  email: string;
  phone: string;
  registrationDate: string;
  address: string;
  compliance: boolean;
  isActive: boolean;
  createdDate?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrap = (value: unknown): any => (value as any)?.data ?? value;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapSupplier = (item: any): SupplierItem => ({
  id: item?.id ?? 0,
  idOrganization: item?.idOrganization ?? 0,
  organizationName: item?.organizationName ?? "Sin organización",
  name: item?.name ?? "",
  description: item?.description ?? "",
  contact: item?.contact ?? "",
  email: item?.email ?? "",
  phone: item?.phone ?? "",
  registrationDate: item?.registrationDate ?? item?.registritionDate ?? "",
  address: item?.address ?? "",
  compliance: item?.compliance ?? false,
  isActive: item?.isActive ?? true,
  createdDate: item?.createdDate,
});

export const useSuppliers = (
  searchTerm: string,
  page: number,
  pageSize = 5,
) => {
  const service = useMemo(() => getSupplier(AXIOS_INSTANCE), []);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [supplier, setSupplier] = useState<SupplierItem | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const refresh = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    try {
      const response = await service.getApiSupplier({
        Name: searchTerm || undefined,
        PageNumber: page,
        PageSize: pageSize,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = response.data;
      const rows = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];
      setSuppliers(rows.map(mapSupplier));
      setTotalCount(payload?.totalItems ?? rows.length);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchTerm, service]);

  const getSupplierById = useCallback(
    async (id: number) => {
      setIsFetching(true);
      try {
        const response = await service.getApiSupplierId(id);
        const item = unwrap(response.data);
        const mapped = item ? mapSupplier(item) : null;
        setSupplier(mapped);
        return mapped;
      } finally {
        setIsFetching(false);
      }
    },
    [service],
  );

  const createSupplier = async (dto: CreateSupplierDto) => {
    await service.postApiSupplier(dto);
    await refresh();
  };
  const updateSupplier = async (id: number, dto: UpdateSupplierDto) => {
    await service.putApiSupplierId(id, dto);
    await refresh();
  };
  const deleteSupplier = async (id: number) => {
    await service.deleteApiSupplierId(id);
    await refresh();
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refresh]);
  return {
    suppliers,
    supplier,
    totalCount,
    isLoading,
    isFetching,
    refresh,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
