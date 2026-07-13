import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
} from "../../../../../@/components/ui/dialog";
import { Button } from "../../../../../@/components/ui/button";
import { X, LayoutGrid, Building2 } from 'lucide-react';
import type { AreaItem } from '../hooks/useAreas';

interface AreaDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    area: AreaItem | null;
}

export const AreaDetailModal: React.FC<AreaDetailModalProps> = ({
    isOpen,
    onClose,
    area,
}) => {
    if (!area) return null;

    const formatFecha = (fechaStr?: string) => {
        if (!fechaStr || fechaStr.startsWith('0001-01-01')) return 'No registrada';

        const fecha = new Date(fechaStr);
        return new Intl.DateTimeFormat('es-HN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(fecha);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md w-[90%] rounded-2xl p-6 bg-white border border-gray-100 shadow-2xl gap-0 select-none animate-in fade-in-50 zoom-in-95 duration-200">

                {/* ─── ENCABEZADO DE ÁREA ─── */}
                <DialogHeader className="text-left flex flex-row items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                        <LayoutGrid className="h-6 w-6 text-[#1a558b]" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                            Detalle de Área
                        </h1>
                        <DialogDescription className="text-xs font-medium text-gray-400">
                            Ficha técnica e información del registro
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* ─── CUERPO INTERNO: INFORMACIÓN DEL ÁREA ─── */}
                <div className="py-5 space-y-4 text-left">

                    {/* Fila: Nombre del Área */}
                    <div className="flex gap-3 items-start">
                        <LayoutGrid className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Nombre del Área</span>
                            <span className="text-sm font-semibold text-slate-700 block select-text">{area.nameArea}</span>
                        </div>
                    </div>

                    {/* Fila: Agencia Asociada */}
                    <div className="flex gap-3 items-start">
                        <Building2 className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Agencia de Adscripción</span>
                            <span className="text-sm font-medium text-slate-600 block select-text">
                                {area.agencyName || 'Sin asignar'}
                            </span>
                        </div>
                    </div>

                    {/* Fila: Estado Actual */}
                    <div className="flex gap-3 items-start">
                        <div className="h-4 w-4 flex items-center justify-center shrink-0">
                            <span className={`h-2 w-2 rounded-full ${area.isActive ? 'bg-[#1b8a65]' : 'bg-[#ef4444]'}`} />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Estado Actual</span>
                            <span className={`text-xs font-black tracking-wide mt-0.5 block ${area.isActive ? 'text-[#1b8a65]' : 'text-[#ef4444]'}`}>
                                {area.isActive ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ─── FOOTER O PIE DEL MODAL ─── */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                    <span className="inline-flex items-center bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider">
                        ID: {area.id} - Creado: {formatFecha(area.createdDate)}
                    </span>

                    <Button
                        onClick={onClose}
                        className="bg-gray-100 hover:bg-gray-200 text-slate-700 hover:text-slate-800 gap-2 font-semibold px-4 h-9 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Cerrar</span>
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};