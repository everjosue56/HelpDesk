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

interface TicketDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  ticket: { id: number; description: string } | null; 
}

export const TicketDeleteModal: React.FC<TicketDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ticket,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!ticket) return null;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(ticket.id);
      onClose();
    } catch (error) {
      console.error("Error al procesar la baja lógica del ticket de soporte:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const truncatedDescription = ticket.description.length > 60 
    ? `${ticket.description.substring(0, 60)}...` 
    : ticket.description;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-125 w-[90%] rounded-3xl p-8 bg-white border-none shadow-2xl flex flex-col gap-0 select-none animate-in fade-in-50 zoom-in-95 duration-200">
        
        {/* Cabecera del Modal */}
        <AlertDialogHeader className="text-center w-full flex flex-col items-center gap-0 pb-2">
          <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-neutral-600 tracking-tight text-center uppercase">
            Confirmación de Desactivación
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="w-full border-t border-neutral-200/60 my-4" />

        {/* Cuerpo del Mensaje */}
        <div className="text-center flex flex-col items-center gap-4 py-2 px-1 w-full">
          <p className="text-[14px] font-black text-red-500 tracking-wide uppercase max-w-sm leading-snug">
            ¿Estás seguro que quieres dar de baja este ticket?
          </p>
          <p className="text-xs sm:text-sm font-bold text-neutral-500 leading-relaxed max-w-95 mx-auto text-center">
            Al desactivar el ticket <span className="text-slate-800 font-mono font-bold bg-slate-50 px-1.5 py-0.5 border border-slate-100 rounded">#{String(ticket.id).padStart(4, '0')}</span> referente a <span className="text-slate-800 font-extrabold">"{truncatedDescription}"</span>, pasará a un estado inactivo. El reporte saldrá del flujo operativo de atención activa en mesa de ayuda.
          </p>
        </div>

        <div className="w-full border-t border-neutral-200/60 my-5" />

        {/* BOTONES ALINEADOS */}
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

          {/* Botón SÍ, DESACTIVAR */}
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-[1.5] sm:flex-none sm:w-56 bg-[#ef4444] hover:bg-[#dc2626] text-white flex items-center justify-center gap-1.5 font-bold h-10 rounded-xl text-xs transition-colors shadow-sm cursor-pointer uppercase tracking-wider whitespace-nowrap"
          >
            <FiTrash2 className="w-6 h-6 stroke-[2.5] shrink-0" />
            <span>
              {isSubmitting ? "Desactivando..." : "Sí, Dar de Baja Ticket"}
            </span>
          </Button>

        </div>

      </AlertDialogContent>
    </AlertDialog>
  );
};