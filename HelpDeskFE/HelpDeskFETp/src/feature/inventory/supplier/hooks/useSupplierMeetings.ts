import { useCallback, useEffect, useMemo, useState } from "react";
import { AXIOS_INSTANCE } from "../../../../api/axios-instance";
import { getSupplierMeeting } from "../../../../api/generated/supplier-meeting/supplier-meeting";
import type {
  CreateSupplierMeetingDto,
  UpdateSupplierMeetingDto,
} from "../../../../api/model";

export interface SupplierMeetingItem {
  id: number;
  idSupplier: number;
  description: string;
  reasonWork: string;
  evidence: string;
  meetingDate: string;
  createdDate?: string;
}

const mapMeeting = (item: any): SupplierMeetingItem => ({
  id: item?.id ?? 0,
  idSupplier: item?.idSupplier ?? 0,
  description: item?.description ?? "",
  reasonWork: item?.reasonWork ?? "",
  evidence: item?.evidence ?? "",
  meetingDate: item?.meetingDate ?? "",
  createdDate: item?.createdDate,
});

export const useSupplierMeetings = (supplierId?: number) => {
  const service = useMemo(() => getSupplierMeeting(AXIOS_INSTANCE), []);
  const [meetings, setMeetings] = useState<SupplierMeetingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!supplierId) return;
    setIsLoading(true);
    try {
      const response = await service.getApiSupplierMeeting({
        PageNumber: 1,
        PageSize: 100,
      });
      const payload: any = response.data;
      const rows = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];
      setMeetings(
        rows
          .filter((item: any) => Number(item.idSupplier) === supplierId)
          .map(mapMeeting),
      );
    } finally {
      setIsLoading(false);
    }
  }, [service, supplierId]);

  const getMeetingById = useCallback(
    async (id: number) => {
      const response = await service.getApiSupplierMeetingId(id);
      const item: any = (response.data as any)?.data ?? response.data;
      return item ? mapMeeting(item) : null;
    },
    [service],
  );
  const createMeeting = async (dto: CreateSupplierMeetingDto) => {
    const response = await service.postApiSupplierMeeting(dto);
    await refresh();
    return Number(
      (response.data as any)?.data?.id ?? (response.data as any)?.id ?? 0,
    );
  };
  const updateMeeting = async (id: number, dto: UpdateSupplierMeetingDto) => {
    await service.putApiSupplierMeetingId(id, dto);
    await refresh();
  };
  const deleteMeeting = async (id: number) => {
    await service.deleteApiSupplierMeetingId(id);
    await refresh();
  };
  const uploadEvidence = async (id: number, file: File) => {
    await service.postApiSupplierMeetingIdUploadEvidence(id, { file });
    await refresh();
  };
  const getEvidence = async (id: number) => {
    const response = await service.getApiSupplierMeetingIdDownloadEvidence(id, {
      responseType: "blob",
    });
    return response.data as unknown as Blob;
  };
  const downloadEvidence = async (id: number, filename: string) => {
    const url = URL.createObjectURL(await getEvidence(id));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "evidencia";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return {
    meetings,
    isLoading,
    refresh,
    getMeetingById,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    uploadEvidence,
    getEvidence,
    downloadEvidence,
  };
};
