import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
} from "../../../../../@/components/ui/dialog";
import { Button } from "../../../../../@/components/ui/button";
import { X, Database, Terminal } from 'lucide-react';
import type { SoftwareSystemItem } from '../hooks/useSoftwareSystems';

interface SoftwareSystemDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    system: SoftwareSystemItem | null;
}

export const SoftwareSystemDetailModal: React.FC<SoftwareSystemDetailModalProps> = ({
    isOpen,
    onClose,
    system,
}) => {
    if (!system) return null;

    const formatFecha = (fechaStr?: string) => {
        if (!fechaStr || fechaStr.startsWith('0001-01-01') || fechaStr === 'N/A') {
            return 'No registrada';
        }

        try {
            const fecha = new Date(fechaStr);
            if (isNaN(fecha.getTime())) {
                return 'No registrada';
            }

            return new Intl.DateTimeFormat('es-HN', {
                day: '2-digit',
                month: '2-digit',       
                year: 'numeric'
            }).format(fecha);
        } catch (error) {
            console.error("Error al formatear fecha:", error);
            return 'No registrada';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md w-[90%] rounded-2xl p-6 bg-white border border-gray-100 shadow-2xl gap-0 select-none animate-in fade-in-50 zoom-in-95 duration-200">

                {/* ─── ENCABEZADO ─── */}
                <DialogHeader className="text-left flex flex-row items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                        <Database className="h-6 w-6 text-[#1a558b]" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                            Detalle de Sistema Afectado
                        </h1>
                        <DialogDescription className="text-xs font-medium text-gray-400">
                            Ficha informativa de la plataforma o software registrado
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* ─── CUERPO INTERNO ─── */}
                <div className="py-5 space-y-4 text-left">

                    {/* Fila: Nombre del Sistema */}
                    <div className="flex gap-3 items-start">
                        <Terminal className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Nombre del Sistema</span>
                            <span className="text-sm font-semibold text-slate-700 block select-text">{system.name}</span>
                        </div>
                    </div>

                </div>

                {/* ─── FOOTER O PIE DEL MODAL ─── */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                    <span className="inline-flex items-center bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider">
                        Id:{system.id} {" "}
                        Creado:{formatFecha(system.createdDate)}
                    </span>

                    <Button
                        onClick={onClose}
                        className="bg-gray-100 hover:bg-gray-200 text-slate-700 hover:text-slate-800 gap-2 font-semibold px-4 h-9 rounded-xl text-xs transition-colors cursor-pointer shadow-none"
                    >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Cerrar</span>
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};