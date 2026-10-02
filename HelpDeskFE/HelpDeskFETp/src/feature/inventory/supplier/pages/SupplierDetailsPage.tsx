import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Trash2,
  User,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSuppliers } from "../hooks/useSuppliers";
import {
  useSupplierMeetings,
  type SupplierMeetingItem,
} from "../hooks/useSupplierMeetings";
import {
  SupplierMeetingForm,
  type SupplierMeetingFormValues,
} from "../components/SupplierMeetingForm";
import type { CreateSupplierMeetingDto } from "../../../../api/model";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../@/components/ui/dialog";

export const SupplierDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const supplierId = Number(id);

  const { supplier, isFetching, getSupplierById } = useSuppliers("", 1, 1);
  const {
    meetings,
    isLoading,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    uploadEvidence,
    getEvidence,
    downloadEvidence,
  } = useSupplierMeetings(supplierId);

  const [editing, setEditing] = useState<SupplierMeetingItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<SupplierMeetingItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [preview, setPreview] = useState<{
    url: string;
    filename: string;
    isPreviewable: boolean;
    isImage: boolean;
  } | null>(null);
  const [previewLoadingId, setPreviewLoadingId] = useState<number | null>(null);

  useEffect(() => {
    if (!preview?.url) return;
    return () => URL.revokeObjectURL(preview.url);
  }, [preview?.url]);

  useEffect(() => {
    if (supplierId) void getSupplierById(supplierId);
  }, [supplierId, getSupplierById]);

  const saveMeeting = async (
    values: SupplierMeetingFormValues,
    file?: File
  ) => {
    try {
      const dto: CreateSupplierMeetingDto = {
        idSupplier: supplierId,
        ...values,
        meetingDate: new Date(values.meetingDate).toISOString(),
      };
      let meetingId = editing?.id ?? 0;
      if (editing) await updateMeeting(meetingId, dto);
      else meetingId = await createMeeting(dto);
      if (file && meetingId) await uploadEvidence(meetingId, file);

      toast.success("Reunión guardada exitosamente");
      setEditing(null);
      setFormOpen(false);
    } catch {
      toast.error("No se pudo guardar la reunión");
    }
  };

  const handleConfirmDelete = async () => {
    if (!meetingToDelete) return;
    try {
      setIsDeleting(true);
      await deleteMeeting(meetingToDelete.id);
      toast.success("Reunión eliminada correctamente");
      setMeetingToDelete(null);
    } catch {
      toast.error("Error al eliminar la reunión");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreviewEvidence = async (meeting: SupplierMeetingItem) => {
    try {
      setPreviewLoadingId(meeting.id);
      const blob = await getEvidence(meeting.id);
      const extension = meeting.evidence.split(".").pop()?.toLowerCase();
      const isPdf = blob.type === "application/pdf" || extension === "pdf";
      const isImage = blob.type.startsWith("image/") ||
        ["png", "jpg", "jpeg", "gif", "webp", "bmp"].includes(extension || "");
      const mimeType = isPdf
        ? "application/pdf"
        : isImage
          ? blob.type || `image/${extension === "jpg" ? "jpeg" : extension}`
          : blob.type;
      const previewBlob = mimeType ? new Blob([blob], { type: mimeType }) : blob;
      setPreview({
        url: URL.createObjectURL(previewBlob),
        filename: meeting.evidence,
        isPreviewable: isPdf || isImage,
        isImage,
      });
    } catch {
      toast.error("No se pudo cargar la vista previa del archivo");
    } finally {
      setPreviewLoadingId(null);
    }
  };

  if (isFetching && !supplier) {
    return (
      <div className="p-6 bg-[#f8f9fa] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm font-bold text-slate-700 animate-pulse shadow-sm max-w-md w-full">
          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-3 text-[#1a558b]" />
          Cargando expediente del proveedor...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left select-none">
      {/* Navegación y Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
            <span
              onClick={() => navigate("/dashboard")}
              className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
            >
              Inicio
            </span>
            <span className="text-neutral-300 font-normal">&gt;</span>
            <span
              onClick={() => navigate("/dashboard/supplier")}
              className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors"
            >
              Proveedores
            </span>
            <span className="text-neutral-300 font-normal">&gt;</span>
            <span className="text-neutral-400 font-semibold">Detalles del Proveedor</span>
          </div>
          <h1 className="text-2xl font-black text-neutral-800 tracking-tight mt-1">
            Expediente de Proveedor
          </h1>
        </div>

        <button
          onClick={() => navigate("/dashboard/supplier")}
          className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 h-10 rounded-xl text-sm transition-colors cursor-pointer border-none shadow-none shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a proveedores
        </button>
      </div>

      {supplier && (
        <>
          {/* Tarjetas de Información Rápida (KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Estado Operativo */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28 relative">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Estado del Proveedor</p>
                <div className="pt-0.5">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${supplier.isActive
                        ? "bg-[#e6f9f0] text-[#1b8a65] border-[#bbf7d0]"
                        : "bg-[#fee2e2] text-[#ef4444] border-[#fecaca]"
                      }`}
                  >
                    {supplier.isActive ? "Activo / Operativo" : "Inactivo / Baja"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                <Building2 className="h-6 w-6 text-[#1a558b]" />
              </div>
            </div>

            {/* Total de Reuniones */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28 relative">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total de Reuniones</p>
                <p className="text-3xl font-bold text-[#1a558b] font-mono">
                  {String(meetings?.length || 0).padStart(2, "0")}
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                <Calendar className="h-6 w-6 text-[#1a558b]" />
              </div>
            </div>

            {/* Cumplimiento de Políticas */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28 relative sm:col-span-2 lg:col-span-1">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Cumplimiento Normativo</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {supplier.compliance ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700">Cumple Políticas</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-700">Pendiente / No Cumple</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-600">
                <FileText className="h-6 w-6 text-[#1a558b]" />
              </div>
            </div>
          </div>

          {/* Ficha Principal del Proveedor */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1a558b] uppercase tracking-wider">
                  {supplier.organizationName || "Organización General"}
                </span>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {supplier.name}
                </h2>
                <p className="text-xs text-gray-400">
                  ID de Registro: <span className="font-mono text-slate-600 font-bold">{supplier.id}</span>
                </p>
              </div>

              <button
                onClick={() => navigate(`/dashboard/supplier/edit/${supplier.id}`)}
                className="inline-flex items-center justify-center gap-2 bg-[#1e5f8a] hover:bg-[#164768] text-white px-4 h-10 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer border-none shrink-0"
              >
                <Edit className="h-4 w-4" />
                Editar Proveedor
              </button>
            </div>

            {/* Datos de Contacto y Dirección */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <User className="h-3.5 w-3.5 text-[#1a558b]" />
                  <span>Contacto Principal</span>
                </div>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {supplier.contact || "No registrado"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Mail className="h-3.5 w-3.5 text-[#1a558b]" />
                  <span>Correo Electrónico</span>
                </div>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {supplier.email || "No registrado"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Phone className="h-3.5 w-3.5 text-[#1a558b]" />
                  <span>Teléfono</span>
                </div>
                <p className="text-sm font-bold text-slate-800 font-mono truncate">
                  {supplier.phone || "No registrado"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Clock className="h-3.5 w-3.5 text-[#1a558b]" />
                  <span>Fecha de Registro</span>
                </div>
                <p className="text-sm font-bold text-slate-800   truncate">
                  {supplier.registrationDate
                    ? new Date(supplier.registrationDate).toLocaleDateString("es-HN")
                    : "No registrada"}
                </p>
              </div>
            </div>

            {/* Dirección y Descripción */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#1a558b]" /> Dirección Física
                </h3>
                <p className="text-sm text-slate-700 bg-slate-50/50 p-3.5 rounded-xl border border-gray-100">
                  {supplier.address || "Dirección no especificada en el sistema."}
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-[#1a558b]" /> Descripción Comercial & Alcance
                </h3>
                <p className="text-sm text-slate-700 bg-slate-50/50 p-3.5 rounded-xl border border-gray-100 leading-relaxed whitespace-pre-line">
                  {supplier.description || "Sin notas u observaciones registradas."}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de Reuniones y Evidencias Documentales */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Reuniones y Evidencias Documentales
                </h2>
                <p className="text-xs text-gray-400">
                  Bitácora de reuniones técnicas, minutas y archivos adjuntos
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#1a558b] hover:bg-[#133f67] text-white px-4 h-10 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer border-none shrink-0"
              >
                <Plus className="h-4 w-4" />
                Nueva Reunión
              </button>
            </div>

            {formOpen && (
              <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 animate-fadeIn">
                <SupplierMeetingForm
                  supplierId={supplierId}
                  initialData={editing}
                  onSubmit={saveMeeting}
                  onCancel={() => {
                    setEditing(null);
                    setFormOpen(false);
                  }}
                />
              </div>
            )}

            {isLoading ? (
              <div className="py-12 text-center text-sm font-bold text-slate-500">
                <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-[#1a558b]" />
                Cargando historial de reuniones...
              </div>
            ) : meetings?.length ? (
              <div className="grid grid-cols-1 gap-3.5">
                {meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white hover:bg-slate-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-800 text-sm">
                          {meeting.reasonWork}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                          {new Date(meeting.meetingDate).toLocaleString("es-HN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {meeting.description || "Sin descripción adicional"}
                      </p>

                      {meeting.evidence && (
                        <div className="pt-1">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                            <FileText className="h-3.5 w-3.5 text-emerald-600" />
                            {meeting.evidence}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Acciones de Reunión */}
                    <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 flex-wrap justify-end">
                      {meeting.evidence && (
                        <button
                          type="button"
                          title="Vista previa del archivo adjunto"
                          disabled={previewLoadingId === meeting.id}
                          onClick={() => void handlePreviewEvidence(meeting)}
                          className="inline-flex items-center gap-1.5 px-3 h-8.5 rounded-xl text-xs font-bold text-[#1a558b] bg-slate-50 hover:bg-[#1a558b]/10 border border-gray-200 shadow-none transition-all duration-200 cursor-pointer disabled:opacity-60"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{previewLoadingId === meeting.id ? "Cargando..." : "Vista previa"}</span>
                        </button>
                      )}

                      {meeting.evidence && (
                        <button
                          type="button"
                          title="Descargar evidencia adjunta"
                          onClick={() => downloadEvidence(meeting.id, meeting.evidence!)}
                          className="inline-flex items-center gap-1.5 px-3 h-8.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/60 shadow-none transition-all duration-200 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Descargar</span>
                        </button>
                      )}

                      <button
                        type="button"
                        title="Editar reunión"
                        onClick={() => {
                          setEditing(meeting);
                          setFormOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 h-8.5 rounded-xl text-xs font-bold text-[#1a558b] bg-slate-50 hover:bg-[#1a558b]/10 border border-gray-200 shadow-none transition-all duration-200 cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5 text-[#1a558b]" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        title="Eliminar reunión"
                        onClick={() => setMeetingToDelete(meeting)}
                        className="inline-flex items-center gap-1.5 px-3 h-8.5 rounded-xl text-xs font-bold text-red-600 bg-red-50/60 hover:bg-red-100 border border-red-200/60 shadow-none transition-all duration-200 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center rounded-2xl border border-dashed border-gray-200 bg-slate-50/50">
                <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Sin reuniones registradas</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Comienza programando o registrando la primera minuta para este proveedor.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de Confirmación para Eliminar Reunión */}
      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="fixed! inset-0! left-0! top-0! h-dvh! max-h-dvh! w-screen! max-w-none! translate-x-0! translate-y-0! grid-rows-[auto_minmax(0,1fr)_auto] gap-3 rounded-none! p-3 sm:p-5">
          <DialogHeader>
            <DialogTitle className="pr-8 normal-case tracking-normal">
              Vista previa del archivo
            </DialogTitle>
            <DialogDescription className="break-all">
              {preview?.filename}
            </DialogDescription>
          </DialogHeader>
          <div className="flex min-h-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {preview?.isPreviewable && preview.isImage ? (
              <img
                src={preview.url}
                alt={preview.filename}
                className="max-h-full max-w-full object-contain"
              />
            ) : preview?.isPreviewable ? (
              <iframe
                src={preview.url}
                title={`Vista previa: ${preview.filename}`}
                className="h-full w-full border-0"
              />
            ) : (
              <div className="space-y-3 px-6 text-center">
                <FileText className="mx-auto h-10 w-10 text-slate-400" />
                <p className="text-sm font-semibold text-slate-700">
                  Este formato no se puede mostrar en vista previa.
                </p>
                <p className="text-xs text-slate-500">
                  Puedes descargarlo para abrirlo en una aplicación compatible.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex-row justify-end">
            {!preview?.isPreviewable && preview && (
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = preview.url;
                  link.download = preview.filename || "evidencia";
                  link.click();
                }}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1a558b] px-3 text-xs font-bold text-white hover:bg-[#133f67]"
              >
                <Download className="h-4 w-4" /> Descargar
              </button>
            )}
            <DialogClose asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cerrar
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {meetingToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-gray-100 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 rounded-xl text-red-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Eliminar Reunión</h2>
                <p className="text-xs text-gray-400">Confirmación de borrado</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              ¿Estás seguro de que deseas eliminar la reunión con motivo{" "}
              <span className="font-bold text-slate-800">"{meetingToDelete.reasonWork}"</span>? Se eliminarán también las evidencias adjuntas vinculadas.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setMeetingToDelete(null)}
                className="px-4 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer border-none disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 h-9 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer border-none shadow-sm disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};