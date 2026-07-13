import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
} from "../../../../../@/components/ui/dialog";
import { Button } from "../../../../../@/components/ui/button";
import { X, Building2, Phone, MapPin, FileText, Globe } from 'lucide-react';
import type { OrganizationItem } from '../hooks/useOrganizations';

interface OrganizationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    organization: OrganizationItem | null;
}

export const OrganizationDetailModal: React.FC<OrganizationDetailModalProps> = ({
    isOpen,
    onClose,
    organization,
}) => {
    if (!organization) return null;

    // Pequeña validación por si la URL del logo es válida
    const hasValidLogo = organization.logo && organization.logo.startsWith('http');

    const formatFecha = (fechaStr?: string) => {
        if (!fechaStr) return 'N/A';

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

                {/* ─── ENCABEZADO CON ICONO O LOGO REAL ─── */}
                <DialogHeader className="text-left flex flex-row items-center gap-4 pb-4 border-b border-gray-100">
                    {hasValidLogo ? (
                        <img
                            src={organization.logo}
                            alt={organization.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                    ) : (
                        <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-slate-700">
                            <Building2 className="h-6 w-6" />
                        </div>
                    )}
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                            Detalle de Organización
                        </h1>
                        <DialogDescription className="text-xs font-medium text-gray-400">
                            Ficha técnica e información del registro
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* ─── CUERPO INTERNO: FICHA TÉCNICA LIMPIA ─── */}
                <div className="py-5 space-y-4 text-left">

                    {/* Fila: Nombre */}
                    <div className="flex gap-3 items-start">
                        <Building2 className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Nombre</span>
                            <span className="text-sm font-semibold text-slate-700 block select-text">{organization.name}</span>
                        </div>
                    </div>

                    {/* Fila: Contacto */}
                    <div className="flex gap-3 items-start">
                        <Phone className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Contacto / Teléfono</span>
                            <span className="text-sm font-medium text-slate-600 block select-text">{organization.contact || 'No asignado'}</span>
                        </div>
                    </div>

                    {/* Fila: Dirección */}
                    <div className="flex gap-3 items-start">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Dirección Física</span>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed select-text">{organization.address || 'Sin dirección registrada'}</p>
                        </div>
                    </div>

                    {/* Fila: Descripción */}
                    <div className="flex gap-3 items-start">
                        <FileText className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Descripción de la Empresa</span>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 bg-slate-50/50 border border-gray-100 p-3 rounded-xl leading-relaxed select-text">
                                {organization.description || 'Sin descripción adicional en el sistema.'}
                            </p>
                        </div>
                    </div>

                    {/* Fila: Enlace del Logo */}
                    {organization.logo && (
                        <div className="flex gap-3 items-start">
                            <Globe className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                            <div className="space-y-0.5 max-w-full">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Enlace del Logo</span>
                                <span className="text-xs text-[#1a558b] font-medium truncate block max-w-70 select-text" title={organization.logo}>
                                    {organization.logo}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── FOOTER O PIE DEL MODAL ─── */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                    <span className="inline-flex items-center bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider">
                        ID: {organization.id} - Creado: {formatFecha(organization.createdDate)}
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