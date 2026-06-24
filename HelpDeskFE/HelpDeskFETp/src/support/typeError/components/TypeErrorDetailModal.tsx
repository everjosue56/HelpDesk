import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogDescription } from "../../../../@/components/ui/dialog";
import { Button } from "../../../../@/components/ui/button";
import { X, AlertTriangle, Terminal } from 'lucide-react';
import type { TypeErrorItem } from '../hooks/useTypeErrors';

interface TypeErrorDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    typeError: TypeErrorItem | null;
}

export const TypeErrorDetailModal: React.FC<TypeErrorDetailModalProps> = ({ isOpen, onClose, typeError }) => {
    if (!typeError) return null;

    const formatFecha = (fechaStr?: string) => {
        if (!fechaStr || fechaStr.startsWith('0001-01-01') || fechaStr === 'N/A') return 'No registrada';
        try {
            const fecha = new Date(fechaStr);
            if (isNaN(fecha.getTime())) return 'No registrada';
            return new Intl.DateTimeFormat('es-HN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha);
        } catch { return 'No registrada'; }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md w-[90%] rounded-2xl p-6 bg-white border border-gray-100 shadow-2xl gap-0 select-none animate-in fade-in-50 zoom-in-95 duration-200">
                <DialogHeader className="text-left flex flex-row items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                        <AlertTriangle className="h-6 w-6 text-[#1a558b]" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">Detalle de Tipo de Error</h1>
                        <DialogDescription className="text-xs font-medium text-gray-400">Ficha informativa de la categoría de incidencia</DialogDescription>
                    </div>
                </DialogHeader>

                <div className="py-5 space-y-4 text-left">
                    <div className="flex gap-3 items-start">
                        <Terminal className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Nombre de la Categoría</span>
                            <span className="text-sm font-semibold text-slate-700 block select-text">{typeError.name}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                    <span className="inline-flex items-center bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider gap-1">
                        <span>Id:{typeError.id}</span>
                        <span className="text-gray-300"></span>
                        <span>Creado: {formatFecha(typeError.createdDate)}</span>
                    </span>
                    <Button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-slate-700 hover:text-slate-800 gap-2 font-semibold px-4 h-9 rounded-xl text-xs transition-colors cursor-pointer shadow-none">
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Cerrar</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};