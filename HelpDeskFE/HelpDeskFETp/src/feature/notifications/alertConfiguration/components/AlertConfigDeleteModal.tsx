import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../../@/components/ui/alert-dialog";
import { Button } from "../../../../../@/components/ui/button";
import { IoCloseOutline } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import type { AlertConfigItem } from '../hooks/useAlertConfigurations';

interface AlertConfigDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  config: AlertConfigItem | null; 
}

export const AlertConfigDeleteModal: React.FC<AlertConfigDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  config,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!config) return null;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(config.id);
      onClose();
    } catch (error) {
      console.error("Error al eliminar la configuración de alerta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-125 w-[90%] rounded-3xl p-8 bg-white border-none shadow-2xl flex flex-col gap-0 select-none animate-in fade-in-50 zoom-in-95 duration-200 text-center">
        
        {/* Cabecera del Modal */}
        <AlertDialogHeader className="text-center w-full flex flex-col items-center gap-0 pb-2">
          <AlertDialogTitle className="text-xl sm:text-2xl font-black text-neutral-600 tracking-tight text-center uppercase">
            Confirmacion de Eliminacion
          </AlertDialogTitle>
        </AlertDialogHeader>

        {/* Línea Divisoria Superior */}
        <div className="w-full border-t border-neutral-200/60 my-4" />

        {/* Cuerpo del Mensaje de Advertencia */}
        <div className="text-center flex flex-col items-center gap-4 py-2 px-1 w-full">
          <p className="text-[14px] font-black text-red-500 tracking-wide uppercase max-w-sm leading-snug">
            ¿Estas seguro que quieres eliminar esta configuracion?
          </p>
          <p className="text-xs sm:text-sm font-bold text-neutral-500 leading-relaxed max-w-95 mx-auto">
            Al eliminar la alerta "{config.title}", el disparador automático quedará anulado y no se enviarán las notificaciones programadas a las áreas correspondientes.
          </p>
        </div>

        {/* Línea Divisoria Inferior */}
        <div className="w-full border-t border-neutral-200/60 my-5" />

        {/* ─── BOTONES ALINEADOS ─── */}
        <div className="flex flex-row items-center justify-center gap-3 w-full">
          
          {/* Botón CANCELAR */}
          <Button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none sm:w-36 bg-[#9ca3af] hover:bg-[#8b93a1] text-white flex items-center justify-center gap-1.5 font-bold h-10 rounded-xl text-xs transition-colors shadow-sm cursor-pointer uppercase tracking-wider"
          >
            <IoCloseOutline className="w-6! h-6! stroke-3 shrink-0" />
            <span>Cancelar</span>
          </Button>

          {/* Botón SÍ, ELIMINAR */}
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-[1.5] sm:flex-none sm:w-56 bg-[#ef4444] hover:bg-[#dc2626] text-white flex items-center justify-center gap-1.5 font-bold h-10 rounded-xl text-xs transition-colors shadow-sm cursor-pointer uppercase tracking-wider whitespace-nowrap"
          >
            <FiTrash2 className="w-6 h-6 stroke-[2.5] shrink-0" />
            <span>
              {isSubmitting ? "Eliminando..." : "Si, Eliminar Alerta"}
            </span>
          </Button>

        </div>

      </AlertDialogContent>
    </AlertDialog>
  );
};