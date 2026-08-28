import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarDays, FileUp, Save, Trash2, X } from "lucide-react";
import { Button } from "../../../../../@/components/ui/button";
import { Input } from "../../../../../@/components/ui/input";
import { Textarea } from "../../../../../@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../@/components/ui/form";
import type { SupplierMeetingItem } from "../hooks/useSupplierMeetings";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export interface SupplierMeetingFormValues {
  description: string;
  reasonWork: string;
  meetingDate: string;
}

interface SupplierMeetingFormProps {
  supplierId: number;
  initialData?: SupplierMeetingItem | null;
  onSubmit: (data: SupplierMeetingFormValues, file?: File) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const SupplierMeetingForm: React.FC<SupplierMeetingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditMode = !!initialData?.id;
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>();
  const [fileError, setFileError] = useState("");

  const form = useForm<SupplierMeetingFormValues>({
    mode: "onBlur",
    defaultValues: {
      description: "",
      reasonWork: "",
      meetingDate: new Date().toISOString().slice(0, 16),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        description: initialData.description || "",
        reasonWork: initialData.reasonWork || "",
        meetingDate: initialData.meetingDate
          ? initialData.meetingDate.slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });
    }
  }, [initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setFile(undefined);
        setFileError("El archivo no puede superar los 50 MB.");
        e.target.value = "";
        return;
      }

      setFileError("");
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(undefined);
    setFileError("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn text-left select-none">
      {/* Encabezado */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
          <CalendarDays className="h-6 w-6 text-[#1a558b]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode ? "Editar Reunión" : "Registrar Nueva Reunión"}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {isEditMode
              ? "Modifica el motivo, fecha o archivo de evidencia de la sesión"
              : "Registra la actividad y adjunta su respaldo documental"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values, file))}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            {/* Motivo del Trabajo */}
            <FormField
              control={form.control}
              name="reasonWork"
              rules={{ required: "El motivo de la reunión es obligatorio." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-700">
                    Motivo de la Reunión / Trabajo
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Revisión trimestral de SLAs y soporte"
                      {...field}
                      className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            {/* Fecha y Hora de la Reunión */}
            <FormField
              control={form.control}
              name="meetingDate"
              rules={{ required: "La fecha de la reunión es obligatoria." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-700">
                    Fecha y Hora de la Sesión
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      className="rounded-xl border-gray-200 h-11 pl-5 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            {/* Descripción y Conclusiones */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-700">
                      Descripción / Minuta de Acuerdos
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalle los temas abordados, compromisos adquiridos o acuerdos establecidos..."
                        {...field}
                        className="rounded-xl border-gray-200 pl-5 min-h-24 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {/* Adjuntar Evidencia Documental */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700 block">
                Evidencia Documental (PDF, Imagen, Acta)
              </label>

              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx"
              />

              <div className="rounded-2xl border border-dashed border-gray-200 bg-slate-50/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileUp className="h-5 w-5 text-[#1a558b]" />
                    <p className="text-sm font-bold text-slate-700">
                      {file ? file.name : "Subir archivo de respaldo"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {file
                      ? `Tamaño: ${(file.size / (1024 * 1024)).toFixed(2)} MB`
                      : "Formatos permitidos: PDF, Word, Excel o imágenes (Máx. 50MB)"}
                  </p>
                  {fileError && (
                    <p className="text-xs font-semibold text-red-500 pt-1">
                      {fileError}
                    </p>
                  )}
                  {!file && initialData?.evidence && (
                    <p className="text-xs font-semibold text-[#1a558b] pt-1">
                      Archivo adjunto actual: {initialData.evidence}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {file && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemoveFile}
                      className="rounded-xl h-10 px-3 text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200 cursor-pointer shadow-none text-xs font-semibold"
                    >
                      <Trash2 className="h-4 w-4" /> Quitar
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-xl h-10 px-4 font-semibold text-slate-700 bg-white hover:bg-slate-100 border-gray-200 cursor-pointer shadow-none text-xs"
                  >
                    <FileUp className="h-4 w-4" />
                    {file ? "Reemplazar archivo" : "Seleccionar archivo"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="rounded-xl h-11 px-6 font-semibold bg-gray-400 hover:bg-gray-500 text-white border-none cursor-pointer shadow-none"
            >
              <X className="h-4 w-4" /> Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl h-11 px-6 font-semibold bg-[#1a558b] hover:bg-[#133f67] text-white cursor-pointer shadow-none"
            >
              <Save className="h-4 w-4" />{" "}
              {isSubmitting ? "Guardando..." : "Guardar Reunión"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};