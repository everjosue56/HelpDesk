import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
} from "../../../../@/components/ui/dialog"; 
import { Button } from "../../../../@/components/ui/button";
import { X, User, Mail, Shield  } from 'lucide-react'; 
import { useAuth } from '@/context/AuthContext';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md w-[90%] rounded-2xl p-6 bg-white border border-gray-100 shadow-2xl gap-0 select-none animate-in fade-in-50 zoom-in-95 duration-200">
                
                {/* ─── ENCABEZADO DE PERFIL ─── */}
                <DialogHeader className="text-left flex flex-row items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-[#1a558b] text-white rounded-xl flex items-center justify-center text-base font-black shrink-0">
                        {user.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                            Mi Perfil de Usuario
                        </h1>
                        <DialogDescription className="text-xs font-medium text-gray-400">
                            Información personal de la cuenta y asignación
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* ─── CUERPO INTERNO ─── */}
                <div className="py-5 space-y-4 text-left">
                    
                    {/* Fila: Nombre de Usuario */}
                    <div className="flex gap-3 items-start">
                        <User className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Nombre de Usuario</span>
                            <span className="text-sm font-semibold text-slate-700 block select-text">{user.username}</span>
                        </div>
                    </div>

                    {/* Fila: Correo Electrónico */}
                    <div className="flex gap-3 items-start">
                        <Mail className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Correo Electrónico</span>
                            <span className="text-sm font-medium text-slate-600 block select-text">{user.email}</span>
                        </div>
                    </div>

                    {/* Fila: Rol del Sistema */}
                    <div className="flex gap-3 items-start">
                        <Shield className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Rol Asignado</span>
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                                {user.roles?.join(', ')}
                            </span>
                        </div>
                    </div>

                   

                </div>

                {/* ─── FOOTER ─── */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                    <span className="inline-flex items-center bg-slate-50 text-slate-400 font-mono text-[10px] px-2 py-0.5 rounded-md font-medium tracking-wider">
                        ID CUENTA: {user.id}
                    </span>

                    <Button
                        onClick={onClose}
                        className="bg-gray-100 hover:bg-gray-200 text-slate-700 hover:text-slate-800 gap-2 font-semibold px-4 h-9 rounded-xl text-xs transition-colors cursor-pointer border-none shadow-none"
                    >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Cerrar</span>
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};